from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.schemas.donor import DonorCreate, DonorUpdateAvailability, DonorResponse
from app.services import donor_service
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/donors", tags=["Donors"])

@router.post("/", response_model=DonorResponse, status_code=status.HTTP_201_CREATED)
def register_donor(
    donor_in: DonorCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return donor_service.register_donor(db=db, donor_in=donor_in, user_id=current_user.id)

@router.get("/search", response_model=List[DonorResponse])
def search_donors(
    blood_group: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    availability: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    return donor_service.search_donors(db, blood_group=blood_group, city=city, availability=availability)

@router.get("/me", response_model=Optional[DonorResponse])
def get_my_donor_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return donor_service.get_donor_by_user_id(db, current_user.id)

@router.patch("/me/availability", response_model=DonorResponse)
def update_my_availability(
    update_in: DonorUpdateAvailability,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return donor_service.update_donor_availability(db, current_user.id, update_in)