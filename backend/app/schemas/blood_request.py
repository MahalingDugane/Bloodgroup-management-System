from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class BloodRequestCreate(BaseModel):
    patient_name: str = Field(..., min_length=2, max_length=100)
    blood_group: str = Field(..., pattern=r"^(A|B|AB|O)[+-]$")
    required_units: int = Field(..., gt=0)
    hospital_name: str = Field(..., min_length=2, max_length=150)
    hospital_address: str = Field(..., min_length=5)
    city: str = Field(..., min_length=2, max_length=100)
    contact_number: str = Field(..., min_length=7, max_length=20)
    urgency: str = Field("Normal", pattern=r"^(Normal|Urgent|Emergency)$")
    reason: Optional[str] = None

class BloodRequestStatusUpdate(BaseModel):
    status: str = Field(..., pattern=r"^(Pending|Approved|Rejected|Completed)$")

class BloodRequestResponse(BaseModel):
    id: int
    user_id: int
    patient_name: str
    blood_group: str
    required_units: int
    hospital_name: str
    hospital_address: str
    city: str
    contact_number: str
    urgency: str
    reason: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True