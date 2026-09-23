from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class BloodRequest(Base):
    __tablename__ = "blood_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    patient_name = Column(String(100), nullable=False)
    blood_group = Column(String(5), nullable=False, index=True)
    required_units = Column(Integer, nullable=False)
    hospital_name = Column(String(150), nullable=False)
    hospital_address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False, index=True)
    contact_number = Column(String(20), nullable=False)
    urgency = Column(String(20), default="Normal", nullable=False, index=True)
    reason = Column(Text, nullable=True)
    status = Column(String(20), default="Pending", nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    user = relationship("User", back_populates="requests")