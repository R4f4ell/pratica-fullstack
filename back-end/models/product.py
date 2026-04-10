from dataclasses import dataclass


@dataclass
class Product:
    id: int
    product_name: str
    quantity_in_stock: int
    quantity_sold: int
    unit_price: float
    revenue: float
