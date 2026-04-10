from fastapi import APIRouter, Query, status

from repositories.product_repository import ProductRepository
from schemas.product import ProductCreate, ProductResponse, ProductUpdate
from services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Produtos"])

product_repository = ProductRepository()
product_service = ProductService(product_repository)


@router.get("/", response_model=list[ProductResponse], status_code=status.HTTP_200_OK)
def list_products(search: str | None = Query(default=None, min_length=1)) -> list[ProductResponse]:
    return product_service.list_products(search)


@router.get("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def get_product(product_id: int) -> ProductResponse:
    return product_service.get_product(product_id)


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(data: ProductCreate) -> ProductResponse:
    return product_service.create_product(data)


@router.put("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def update_product(product_id: int, data: ProductUpdate) -> ProductResponse:
    return product_service.update_product(product_id, data)


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(product_id: int) -> dict[str, str]:
    return product_service.delete_product(product_id)
