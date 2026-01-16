from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str
    groq_api_key: str
    groq_model: str = "llama-3.1-70b-versatile"
    environment: str = "production"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
