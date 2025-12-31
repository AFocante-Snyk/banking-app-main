"""
Application configuration using Pydantic Settings
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""

    # App settings
    APP_NAME: str = "Luminous Banking AI Workflow"
    DEBUG: bool = False

    # OpenAI settings
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    OPENAI_MAX_TOKENS: int = 1000
    OPENAI_TEMPERATURE: float = 0.3

    # Rate limits
    BASE_SAVINGS_RATE: float = 0.045
    BASE_CHECKING_RATE: float = 0.01
    BASE_MONEY_MARKET_RATE: float = 0.05
    BASE_CD_RATE: float = 0.055

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

