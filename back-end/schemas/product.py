from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    product_name: str = Field(..., min_length=1, max_length=100)
    quantity_in_stock: int = Field(..., ge=0)
    quantity_sold: int = Field(..., ge=0)
    unit_price: float = Field(..., gt=0)


class ProductUpdate(BaseModel):
    product_name: str = Field(..., min_length=1, max_length=100)
    quantity_in_stock: int = Field(..., ge=0)
    quantity_sold: int = Field(..., ge=0)
    unit_price: float = Field(..., gt=0)


class ProductResponse(BaseModel):
    id: int
    product_name: str = Field(..., min_length=1, max_length=100)
    quantity_in_stock: int = Field(..., ge=0)
    quantity_sold: int = Field(..., ge=0)
    unit_price: float = Field(..., gt=0)
    revenue: float
