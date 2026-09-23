from datetime import datetime
from pydantic import BaseModel, Field

class BloodStockUpdate(BaseModel):
    blood_group: str = Field(..., pattern=r"^(A|B|AB|O)[+-]$")
    available_units: int = Field(..., ge=0)

class BloodStockResponse(BaseModel):
    blood_group: str
    available_units: int
    last_updated: datetime

    class Config:
        from_attributes = True