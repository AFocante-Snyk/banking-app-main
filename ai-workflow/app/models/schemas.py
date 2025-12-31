"""
Pydantic models for the Interest Rate API
"""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class AccountType(str, Enum):
    CHECKING = "CHECKING"
    SAVINGS = "SAVINGS"
    MONEY_MARKET = "MONEY_MARKET"
    CERTIFICATE_OF_DEPOSIT = "CERTIFICATE_OF_DEPOSIT"


class EmploymentStatus(str, Enum):
    EMPLOYED = "EMPLOYED"
    SELF_EMPLOYED = "SELF_EMPLOYED"
    UNEMPLOYED = "UNEMPLOYED"
    RETIRED = "RETIRED"
    STUDENT = "STUDENT"


class RiskCategory(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    VERY_HIGH = "VERY_HIGH"


class InterestRateRequest(BaseModel):
    """Request model for interest rate calculation"""

    credit_score: Optional[int] = Field(
        None,
        ge=300,
        le=850,
        alias="creditScore",
        description="Customer's credit score (300-850)",
    )
    annual_income: Optional[float] = Field(
        None,
        ge=0,
        alias="annualIncome",
        description="Customer's annual income in USD",
    )
    employment_status: Optional[EmploymentStatus] = Field(
        None,
        alias="employmentStatus",
        description="Customer's employment status",
    )
    age: Optional[int] = Field(
        None,
        ge=18,
        le=120,
        description="Customer's age in years",
    )
    account_type: AccountType = Field(
        ...,
        alias="accountType",
        description="Type of account being opened",
    )
    state: Optional[str] = Field(
        None,
        max_length=50,
        description="Customer's state of residence",
    )

    class Config:
        populate_by_name = True


class InterestRateResponse(BaseModel):
    """Response model for interest rate calculation"""

    interest_rate: float = Field(
        ...,
        alias="interestRate",
        description="Calculated interest rate (as decimal, e.g., 0.045 for 4.5%)",
    )
    risk_category: str = Field(
        ...,
        alias="riskCategory",
        description="Customer's risk category based on their profile",
    )
    explanation: str = Field(
        ...,
        description="Detailed explanation of how the rate was determined",
    )
    factors: List[str] = Field(
        ...,
        description="List of factors that influenced the rate calculation",
    )
    approved: bool = Field(
        ...,
        description="Whether the account opening is approved",
    )

    class Config:
        populate_by_name = True

