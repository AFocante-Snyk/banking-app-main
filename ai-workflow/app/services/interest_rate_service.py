"""
Interest Rate Service using OpenAI for intelligent rate determination
"""

import json
import logging
from typing import Optional

from openai import OpenAI

from app.core.config import settings
from app.models.schemas import (
    InterestRateRequest,
    InterestRateResponse,
    AccountType,
    RiskCategory,
)

logger = logging.getLogger(__name__)


class InterestRateService:
    """Service for calculating personalized interest rates using AI"""

    def __init__(self):
        self.client: Optional[OpenAI] = None
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def calculate_interest_rate(
        self, request: InterestRateRequest
    ) -> InterestRateResponse:
        """
        Calculate personalized interest rate based on customer profile.
        Uses OpenAI if available, otherwise falls back to rule-based calculation.
        """
        if self.client and settings.OPENAI_API_KEY:
            try:
                return self._calculate_with_ai(request)
            except Exception as e:
                logger.warning(f"AI calculation failed, using fallback: {e}")
                return self._calculate_fallback(request)
        else:
            return self._calculate_fallback(request)

    def _calculate_with_ai(
        self, request: InterestRateRequest
    ) -> InterestRateResponse:
        """Use OpenAI to analyze customer profile and determine interest rate"""

        system_prompt = """You are an AI banking assistant that determines personalized interest rates for customers based on their financial profile.

You must analyze the customer's information and determine:
1. An appropriate interest rate (as a decimal, e.g., 0.045 for 4.5% APY)
2. A risk category (LOW, MEDIUM, HIGH, or VERY_HIGH)
3. Whether to approve the account opening
4. Key factors that influenced your decision

Base rates by account type:
- CHECKING: 0.01 (1.0% APY)
- SAVINGS: 0.045 (4.5% APY)
- MONEY_MARKET: 0.05 (5.0% APY)
- CERTIFICATE_OF_DEPOSIT: 0.055 (5.5% APY)

Adjust rates based on:
- Credit score: Higher scores (+0.5% bonus for 750+), lower scores (-0.25% to -0.5% penalty)
- Income stability: Stable employment adds +0.25%
- Age: No discrimination, but consider financial maturity
- Overall risk profile

Respond ONLY with a JSON object in this exact format:
{
    "interestRate": 0.045,
    "riskCategory": "LOW",
    "explanation": "Your detailed explanation here",
    "factors": ["factor1", "factor2", "factor3"],
    "approved": true
}"""

        user_prompt = f"""Analyze this customer profile and determine their personalized interest rate:

Account Type: {request.account_type.value}
Credit Score: {request.credit_score if request.credit_score else 'Not provided'}
Annual Income: ${request.annual_income:,.2f} if request.annual_income else 'Not provided'
Employment Status: {request.employment_status.value if request.employment_status else 'Not provided'}
Age: {request.age if request.age else 'Not provided'} years
State: {request.state if request.state else 'Not provided'}

Provide your analysis and rate determination."""

        response = self.client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=settings.OPENAI_MAX_TOKENS,
            temperature=settings.OPENAI_TEMPERATURE,
            response_format={"type": "json_object"},
        )

        result = json.loads(response.choices[0].message.content)

        return InterestRateResponse(
            interest_rate=result["interestRate"],
            risk_category=result["riskCategory"],
            explanation=result["explanation"],
            factors=result["factors"],
            approved=result["approved"],
        )

    def _calculate_fallback(
        self, request: InterestRateRequest
    ) -> InterestRateResponse:
        """Rule-based fallback calculation when AI is unavailable"""

        # Base rate by account type
        base_rates = {
            AccountType.CHECKING: settings.BASE_CHECKING_RATE,
            AccountType.SAVINGS: settings.BASE_SAVINGS_RATE,
            AccountType.MONEY_MARKET: settings.BASE_MONEY_MARKET_RATE,
            AccountType.CERTIFICATE_OF_DEPOSIT: settings.BASE_CD_RATE,
        }

        base_rate = base_rates.get(request.account_type, 0.01)
        adjustment = 0.0
        factors = [f"Base rate for {request.account_type.value}"]
        approved = True
        risk_category = RiskCategory.MEDIUM

        # Credit score adjustments
        if request.credit_score:
            if request.credit_score >= 800:
                adjustment += 0.0075  # Excellent: +0.75%
                risk_category = RiskCategory.LOW
                factors.append("Excellent credit score (800+): +0.75%")
            elif request.credit_score >= 750:
                adjustment += 0.005  # Very good: +0.5%
                risk_category = RiskCategory.LOW
                factors.append("Very good credit score (750-799): +0.50%")
            elif request.credit_score >= 700:
                adjustment += 0.0025  # Good: +0.25%
                risk_category = RiskCategory.LOW
                factors.append("Good credit score (700-749): +0.25%")
            elif request.credit_score >= 650:
                risk_category = RiskCategory.MEDIUM
                factors.append("Fair credit score (650-699): No adjustment")
            elif request.credit_score >= 550:
                adjustment -= 0.0025  # Below average: -0.25%
                risk_category = RiskCategory.HIGH
                factors.append("Below average credit score (550-649): -0.25%")
            else:
                adjustment -= 0.005  # Poor: -0.5%
                risk_category = RiskCategory.VERY_HIGH
                factors.append("Poor credit score (<550): -0.50%")
                if request.credit_score < 400:
                    approved = False
                    factors.append("Credit score below minimum threshold")

        # Employment adjustments
        if request.employment_status:
            if request.employment_status.value in ["EMPLOYED", "SELF_EMPLOYED"]:
                adjustment += 0.0025
                factors.append("Stable employment: +0.25%")
            elif request.employment_status.value == "RETIRED":
                adjustment += 0.001
                factors.append("Retired with stable income: +0.10%")
            elif request.employment_status.value == "STUDENT":
                factors.append("Student status: No adjustment")
            else:
                adjustment -= 0.001
                factors.append("Unemployed: -0.10%")

        # Income-based adjustments
        if request.annual_income:
            if request.annual_income >= 150000:
                adjustment += 0.0025
                factors.append("High income ($150k+): +0.25%")
            elif request.annual_income >= 75000:
                adjustment += 0.001
                factors.append("Above average income: +0.10%")
            elif request.annual_income < 25000:
                factors.append("Lower income: No penalty applied")

        # Calculate final rate (ensure it doesn't go below 0)
        final_rate = max(base_rate + adjustment, 0.001)

        explanation = (
            f"Based on your profile, we've calculated a personalized interest rate of "
            f"{final_rate * 100:.2f}% APY for your {request.account_type.value.replace('_', ' ').title()} account. "
        )

        if approved:
            explanation += "Your application has been approved."
        else:
            explanation += (
                "Unfortunately, your application could not be approved at this time. "
                "Please contact our support team for more information."
            )

        return InterestRateResponse(
            interest_rate=round(final_rate, 4),
            risk_category=risk_category.value,
            explanation=explanation,
            factors=factors,
            approved=approved,
        )


# Singleton instance
interest_rate_service = InterestRateService()

