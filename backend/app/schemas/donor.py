from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field

class DonorCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    blood_group: str = Field(..., pattern=r"^(A|B|AB|O)[+-]$")
    phone: str = Field(..., min_length=7, max_length=20)
    age: int = Field(..., ge=18, le=65)
    gender: str = Field(..., min_length=1, max_length=15)
    address: str = Field(..., min_length=3, max_length=255)
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    last_donation_date: Optional[date] = None
    availability: bool = True

class DonorUpdateAvailability(BaseModel):
    availability: bool

class DonorResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    blood_group: str
    phone: str
    age: int
    gender: str
    address: str
    city: str
    state: str
    last_donation_date: Optional[date] = None
    availability: bool
    created_at: datetime

    class Config:
        from_attributes = True