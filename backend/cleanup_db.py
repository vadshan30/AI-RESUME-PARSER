import asyncio
import logging
from sqlalchemy import text
from backend.database import SessionLocal, engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clear_resumes():
    """Deletes all records from the resumes table."""
    db = SessionLocal()
    try:
        if engine.dialect.name == "postgresql":
            db.execute(text("TRUNCATE TABLE resumes CASCADE;"))
        else:
            db.execute(text("DELETE FROM resumes;"))
            
        db.commit()
        logger.info("Database cleanup complete! All test resumes have been removed.")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to clear database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_resumes()
