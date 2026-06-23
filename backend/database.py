import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Render fornece DATABASE_URL para PostgreSQL.
# Localmente, usa SQLite como fallback.
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./acad_app.db")

# Render usa "postgres://", mas SQLAlchemy precisa de "postgresql://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite precisa de check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency injection para sessão do banco."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

