from models.product import Product


class ProductRepository:
    def __init__(self) -> None:
        self._products: list[Product] = [
            Product(
                id=23,
                product_name="Leite",
                quantity_in_stock=200,
                quantity_sold=20,
                unit_price=300,
                revenue=6000,
            ),
            Product(
                id=24,
                product_name="Leite",
                quantity_in_stock=1000,
                quantity_sold=600,
                unit_price=390,
                revenue=234000,
            ),
            Product(
                id=25,
                product_name="Laranja",
                quantity_in_stock=200,
                quantity_sold=20,
                unit_price=199,
                revenue=3980,
            ),
            Product(
                id=26,
                product_name="Laranja",
                quantity_in_stock=200,
                quantity_sold=30,
                unit_price=300,
                revenue=9000,
            ),
        ]
        self._next_id = 27

    def list_all(self) -> list[Product]:
        return self._products

    def get_by_id(self, product_id: int) -> Product | None:
        return next((product for product in self._products if product.id == product_id), None)

    def create(self, product: Product) -> Product:
        self._products.append(product)
        self._next_id += 1
        return product

    def update(self, product: Product) -> Product:
        for index, current_product in enumerate(self._products):
            if current_product.id == product.id:
                self._products[index] = product
                return product

        raise ValueError("Produto nao encontrado para atualizacao.")

    def delete(self, product_id: int) -> bool:
        product = self.get_by_id(product_id)
        if product is None:
            return False

        self._products.remove(product)
        return True

    def generate_id(self) -> int:
        return self._next_id
