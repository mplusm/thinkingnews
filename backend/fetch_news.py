#!/usr/bin/env python3
"""Script to fetch news from all sources. Run via cron every 15 minutes."""

import sys
import os

# Ensure we're in the right directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from fetcher import fetch_all_feeds
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    logger.info("Starting news fetch...")
    db = SessionLocal()
    try:
        results = fetch_all_feeds(db)
        logger.info(f"Fetch complete: {results['total_added']} articles added from {results['sources_processed']} sources")
        if results['errors']:
            for error in results['errors']:
                logger.error(error)
    except Exception as e:
        logger.error(f"Fetch failed: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
