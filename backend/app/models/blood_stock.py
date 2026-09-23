from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database.connection import Base

class BloodStock(Base):
    __tablename__ = "blood_stock"

    id = Column(Integer, primary_key=True, index=True)
    blood_group = Column(String(5), unique=True, index=True, nullable=False)
    available_units = Column(Integer, default=0, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)