from typing import Protocol

from models.product import Product


class ProductRepositoryProtocol(Protocol):
    def list_all(self, search: str | None = None) -> list[Product]:
        ...

    def get_by_id(self, product_id: int) -> Product | None:
        ...

    def create(self, product: Product) -> Product:
        ...

    def update(self, product: Product) -> Product:
        ...

    def delete(self, product_id: int) -> bool:
        ...
