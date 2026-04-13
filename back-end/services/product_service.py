from fastapi import HTTPException, status

from models.product import Product
from repositories.product_repository_protocol import ProductRepositoryProtocol
from repositories.repository_errors import RepositoryError
from schemas.product import ProductCreate, ProductResponse, ProductUpdate


class ProductService:
    def __init__(self, repository: ProductRepositoryProtocol) -> None:
        self._repository = repository

    def list_products(self, search: str | None = None) -> list[ProductResponse]:
        try:
            products = self._repository.list_all(search)
            return [self._to_response(product) for product in products]
        except RepositoryError as error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Nao foi possivel listar os produtos.",
            ) from error

    def get_product(self, product_id: int) -> ProductResponse:
        try:
            product = self._repository.get_by_id(product_id)
        except RepositoryError as error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Nao foi possivel buscar o produto.",
            ) from error

        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produto nao encontrado.",
            )

        return self._to_response(product)

    def create_product(self, data: ProductCreate) -> ProductResponse:
        self._validate_quantities(data.quantity_in_stock, data.quantity_sold)

        try:
            product = Product(
                id=0,
                product_name=data.product_name,
                quantity_in_stock=data.quantity_in_stock,
                quantity_sold=data.quantity_sold,
                unit_price=data.unit_price,
                revenue=self._calculate_revenue(data.quantity_sold, data.unit_price),
            )

            created_product = self._repository.create(product)
        except RepositoryError as error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Nao foi possivel criar o produto.",
            ) from error

        return self._to_response(created_product)

    def update_product(self, product_id: int, data: ProductUpdate) -> ProductResponse:
        try:
            existing_product = self._repository.get_by_id(product_id)
        except RepositoryError as error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Nao foi possivel buscar o produto para atualizacao.",
            ) from error

        if existing_product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produto nao encontrado.",
            )

        product_name = (
            data.product_name
            if data.product_name is not None
            else existing_product.product_name
        )
        quantity_in_stock = (
            data.quantity_in_stock
            if data.quantity_in_stock is not None
            else existing_product.quantity_in_stock
        )
        quantity_sold = (
            data.quantity_sold
            if data.quantity_sold is not None
            else existing_product.quantity_sold
        )
        unit_price = (
            data.unit_price
            if data.unit_price is not None
            else existing_product.unit_price
        )

        self._validate_quantities(quantity_in_stock, quantity_sold)

        updated_product = Product(
            id=existing_product.id,
            product_name=product_name,
            quantity_in_stock=quantity_in_stock,
            quantity_sold=quantity_sold,
            unit_price=unit_price,
            revenue=self._calculate_revenue(quantity_sold, unit_price),
        )

        try:
            saved_product = self._repository.update(updated_product)
        except RepositoryError as error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Nao foi possivel atualizar o produto.",
            ) from error

        return self._to_response(saved_product)

    def delete_product(self, product_id: int) -> dict[str, str]:
        try:
            deleted = self._repository.delete(product_id)
        except RepositoryError as error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Nao foi possivel excluir o produto.",
            ) from error

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
