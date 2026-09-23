from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class DonorCreate(BaseModel):
    blood_group: str = Field(..., pattern=r"^(A|B|AB|O)[+-]$")
    age: int = Field(..., ge=18, le=65)
    gender: str = Field(..., min_length=1, max_length=15)
    city: str = Field(..., min_length=2, max_length=100)
    is_available: bool = True

class DonorResponse(BaseModel):
    id: int
    blood_group: str
    age: int
    gender: str
    city: str
    is_available: bool
    user: UserResponse

    class Config:
        from_attributes = True

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
    patient_name: str
    blood_group: str
    required_units: int
    hospital_name: str
    hospital_address: str
    city: str
    contact_number: str
    urgency: str
    reason: Optional[str]
    status: str
    created_at: datetime
    requester_id: int

    class Config:
        from_attributes = True

class BloodStockUpdate(BaseModel):
    blood_group: str = Field(..., pattern=r"^(A|B|AB|O)[+-]$")
    units: int = Field(..., ge=0)

class BloodStockResponse(BaseModel):
    blood_group: str
    units_available: int
    updated_at: datetime

    class Config:
        from_attributes = True