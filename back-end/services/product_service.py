from fastapi import HTTPException, status

from models.product import Product
from repositories.product_repository import ProductRepository
from schemas.product import ProductCreate, ProductResponse, ProductUpdate


class ProductService:
    def __init__(self, repository: ProductRepository) -> None:
        self._repository = repository

    def list_products(self, search: str | None = None) -> list[ProductResponse]:
        products = self._repository.list_all()

        if search:
            normalized_search = search.lower().strip()
            products = [
                product
                for product in products
                if normalized_search in product.product_name.lower()
            ]

        return [self._to_response(product) for product in products]

    def get_product(self, product_id: int) -> ProductResponse:
        product = self._repository.get_by_id(product_id)
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produto nao encontrado.",
            )

        return self._to_response(product)

    def create_product(self, data: ProductCreate) -> ProductResponse:
        self._validate_quantities(data.quantity_in_stock, data.quantity_sold)

        product = Product(
            id=self._repository.generate_id(),
            product_name=data.product_name,
            quantity_in_stock=data.quantity_in_stock,
            quantity_sold=data.quantity_sold,
            unit_price=data.unit_price,
            revenue=self._calculate_revenue(data.quantity_sold, data.unit_price),
        )

        created_product = self._repository.create(product)
        return self._to_response(created_product)

    def update_product(self, product_id: int, data: ProductUpdate) -> ProductResponse:
        existing_product = self._repository.get_by_id(product_id)
        if existing_product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produto nao encontrado.",
            )

        self._validate_quantities(data.quantity_in_stock, data.quantity_sold)

        updated_product = Product(
            id=existing_product.id,
            product_name=data.product_name,
            quantity_in_stock=data.quantity_in_stock,
            quantity_sold=data.quantity_sold,
            unit_price=data.unit_price,
            revenue=self._calculate_revenue(data.quantity_sold, data.unit_price),
        )

        self._repository.update(updated_product)
        return self._to_response(updated_product)

    def delete_product(self, product_id: int) -> dict[str, str]:
        deleted = self._repository.delete(product_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produto nao encontrado.",
            )

        return {"message": "Produto removido com sucesso."}

    def _validate_quantities(self, quantity_in_stock: int, quantity_sold: int) -> None:
        if quantity_sold > quantity_in_stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A quantidade vendida nao pode ser maior que a quantidade em estoque.",
            )

    def _calculate_revenue(self, quantity_sold: int, unit_price: float) -> float:
        return quantity_sold * unit_price

    def _to_response(self, product: Product) -> ProductResponse:
        return ProductResponse(
            id=product.id,
            product_name=product.product_name,
            quantity_in_stock=product.quantity_in_stock,
            quantity_sold=product.quantity_sold,
            unit_price=product.unit_price,
            revenue=product.revenue,
        )
