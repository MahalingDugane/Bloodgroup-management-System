from typing import List
from sqlalchemy.orm import Session
from app.models.blood_stock import BloodStock
from app.schemas.blood_stock import BloodStockUpdate

STANDARD_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

def get_all_stock(db: Session) -> List[BloodStock]:
    stocks = {s.blood_group: s for s in db.query(BloodStock).all()}
    result = []
    for bg in STANDARD_BLOOD_GROUPS:
        if bg in stocks:
            result.append(stocks[bg])
        else:
            new_stock = BloodStock(blood_group=bg, available_units=0)
            db.add(new_stock)
            db.commit()
            db.refresh(new_stock)
            result.append(new_stock)
    return result

def update_stock(db: Session, stock_in: BloodStockUpdate) -> BloodStock:
    stock = db.query(BloodStock).filter(BloodStock.blood_group == stock_in.blood_group).first()
    if not stock:
        stock = BloodStock(blood_group=stock_in.blood_group, available_units=stock_in.available_units)
        db.add(stock)
    else:
        stock.available_units = stock_in.available_units
    db.commit()
    db.refresh(stock)
    return stock