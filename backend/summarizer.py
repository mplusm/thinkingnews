from groq import Groq
from config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

client = Groq(api_key=settings.groq_api_key)

SUMMARIZATION_PROMPT = """You are a tech news summarizer. Create a concise summary of this article.

Requirements:
- Maximum 60 words
- Preserve key facts, numbers, and names
- Write in clear, objective language
- Focus on the most newsworthy elements
- No opinions or speculation

Article:
{content}

Summary (60 words max):"""


def summarize_article(content: str, title: str = "") -> str | None:
    """Summarize article content using Groq API."""
    if not content or len(content.strip()) < 50:
        return None

    # Truncate very long content
    text = f"{title}\n\n{content}" if title else content
    text = text[:8000]

    try:
        response = client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "user",
                    "content": SUMMARIZATION_PROMPT.format(content=text)
                }
            ],
            max_tokens=150,
            temperature=0.3,
        )
        summary = response.choices[0].message.content.strip()
        return summary
    except Exception as e:
        logger.error(f"Summarization failed: {e}")
        return None
