import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Use PyMySQL as the MySQL driver
# Localhost default connection for development
# Change credentials if your MySQL server uses a different user/password/database
#SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost:3306/resume_ats"
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:Vadxan%402006@localhost:3306/resume_ats"
# Create engine. 
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    Dependency to get the database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
