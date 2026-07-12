import os
from sqlalchemy import create_engine, text

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "mysql+pymysql://root:Vadxan%402006@localhost:3306/resume_ats"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)

def add_column():
    try:
        with engine.connect() as conn:
            # Check if column exists
            result = conn.execute(text("SHOW COLUMNS FROM resumes LIKE 'file_path'"))
            if result.fetchone():
                print("Column 'file_path' already exists in 'resumes' table.")
            else:
                conn.execute(text("ALTER TABLE resumes ADD COLUMN file_path VARCHAR(500) NULL"))
                print("Successfully added 'file_path' column to 'resumes' table.")
    except Exception as e:
        print(f"Error updating database schema: {e}")

if __name__ == "__main__":
    add_column()
