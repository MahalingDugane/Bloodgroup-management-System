from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.schemas.blood_request import BloodRequestCreate, BloodRequestStatusUpdate, BloodRequestResponse
from app.schemas.blood_stock import BloodStockUpdate, BloodStockResponse
from app.services import request_service, inventory_service
from app.utils.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/requests", tags=["Requests & Inventory"])

# Static inventory endpoints MUST reside before parameterized /{request_id}
@router.get("/inventory/stock", response_model=List[BloodStockResponse])
def get_inventory_stock(db: Session = Depends(get_db)):
    return inventory_service.get_all_stock(db)

@router.put("/inventory/stock", response_model=BloodStockResponse)
def update_inventory_stock(
    stock_in: BloodStockUpdate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return inventory_service.update_stock(db, stock_in)

@router.post("/", response_model=BloodRequestResponse, status_code=status.HTTP_201_CREATED)
def submit_request(
    req_in: BloodRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return request_service.create_blood_request(db, req_in, current_user.id)

@router.get("/my-requests", response_model=List[BloodRequestResponse])
def get_my_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return request_service.get_user_requests(db, current_user.id)

@router.get("/", response_model=List[BloodRequestResponse])
def get_all_requests(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return request_service.get_all_requests(db)

@router.get("/{request_id}", response_model=BloodRequestResponse)
def get_single_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = request_service.get_request_by_id(db, request_id)
    if current_user.role != "ADMIN" and req.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    return req

@router.patch("/{request_id}/status", response_model=BloodRequestResponse)
def update_status(
    request_id: int,
    update_in: BloodRequestStatusUpdate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return request_service.update_request_status(db, request_id, update_in)