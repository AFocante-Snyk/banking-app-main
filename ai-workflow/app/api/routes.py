"""
API Routes for the Interest Rate Service
"""

import logging
from fastapi import APIRouter, HTTPException

from app.models.schemas import InterestRateRequest, InterestRateResponse
from app.services.interest_rate_service import interest_rate_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/interest-rate/calculate",
    response_model=InterestRateResponse,
    summary="Calculate Interest Rate",
    description="Calculate a personalized interest rate based on customer profile using AI",
    tags=["Interest Rate"],
)
async def calculate_interest_rate(
    request: InterestRateRequest,
) -> InterestRateResponse:
    """
    Calculate personalized interest rate for a customer.

    The AI analyzes the customer's profile including:
    - Credit score
    - Annual income
    - Employment status
    - Age
    - State of residence
    - Account type

    Returns a personalized interest rate, risk category, and approval status.
    """
    try:
        logger.info(f"Calculating interest rate for account type: {request.account_type}")
        result = interest_rate_service.calculate_interest_rate(request)
        logger.info(
            f"Calculated rate: {result.interest_rate}, "
            f"Risk: {result.risk_category}, "
            f"Approved: {result.approved}"
        )
        return result
    except Exception as e:
        logger.error(f"Error calculating interest rate: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating interest rate: {str(e)}",
        )


@router.get(
    "/interest-rate/base-rates",
    summary="Get Base Interest Rates",
    description="Get the base interest rates for each account type",
    tags=["Interest Rate"],
)
async def get_base_rates():
    """Get base interest rates for all account types"""
    from app.core.config import settings

    return {
        "rates": {
            "CHECKING": {
                "rate": settings.BASE_CHECKING_RATE,
                "apy": f"{settings.BASE_CHECKING_RATE * 100:.2f}%",
            },
            "SAVINGS": {
                "rate": settings.BASE_SAVINGS_RATE,
                "apy": f"{settings.BASE_SAVINGS_RATE * 100:.2f}%",
            },
            "MONEY_MARKET": {
                "rate": settings.BASE_MONEY_MARKET_RATE,
                "apy": f"{settings.BASE_MONEY_MARKET_RATE * 100:.2f}%",
            },
            "CERTIFICATE_OF_DEPOSIT": {
                "rate": settings.BASE_CD_RATE,
                "apy": f"{settings.BASE_CD_RATE * 100:.2f}%",
            },
        },
        "note": "Actual rates may vary based on your personal profile",
    }


@router.post(
    "/interest-rate/simulate",
    response_model=InterestRateResponse,
    summary="Simulate Interest Rate",
    description="Simulate an interest rate calculation without saving",
    tags=["Interest Rate"],
)
async def simulate_interest_rate(
    request: InterestRateRequest,
) -> InterestRateResponse:
    """
    Simulate interest rate calculation for testing or preview purposes.
    Same as calculate but explicitly marked as simulation.
    """
    return interest_rate_service.calculate_interest_rate(request)

