import httpx

from core.supabase_client import supabase_client
from models.product import Product
from repositories.repository_errors import RepositoryError


class SupabaseProductRepository:
    def __init__(self, client: httpx.Client = supabase_client) -> None:
        self._client = client
        self._table = "products"
        self._select_fields = (
            "id,product_name,quantity_in_stock,quantity_sold,unit_price,revenue"
        )

    def list_all(self, search: str | None = None) -> list[Product]:
        params: dict[str, str] = {
            "select": self._select_fields,
            "order": "id.asc",
        }

        if search:
            params["product_name"] = f"ilike.*{search.strip()}*"

        data = self._request("GET", self._table, params=params)
        return [self._map_product(item) for item in data]

    def get_by_id(self, product_id: int) -> Product | None:
        data = self._request(
            "GET",
            self._table,
            params={
                "select": self._select_fields,
                "id": f"eq.{product_id}",
                "limit": "1",
            },
        )

        if not data:
            return None

        return self._map_product(data[0])

    def create(self, product: Product) -> Product:
        data = self._request(
            "POST",
            self._table,
            json=self._to_payload(product),
            headers={"Prefer": "return=representation"},
        )

        if not data:
            raise RepositoryError("Falha ao criar o produto no Supabase.")

        return self._map_product(data[0])

    def update(self, product: Product) -> Product:
        data = self._request(
            "PATCH",
            self._table,
            params={"id": f"eq.{product.id}"},
            json=self._to_payload(product),
            headers={"Prefer": "return=representation"},
        )

        if not data:
            raise RepositoryError("Falha ao atualizar o produto no Supabase.")

        return self._map_product(data[0])

    def delete(self, product_id: int) -> bool:
        data = self._request(
            "DELETE",
            self._table,
            params={"id": f"eq.{product_id}"},
            headers={"Prefer": "return=representation"},
        )
        return len(data) > 0

    def _request(
        self,
        method: str,
        path: str,
        params: dict[str, str] | None = None,
        json: dict[str, str | int | float] | None = None,
        headers: dict[str, str] | None = None,
    ) -> list[dict]:
        try:
            response = self._client.request(
                method=method,
                url=path,
                params=params,
                json=json,
                headers=headers,
            )
            response.raise_for_status()
        except httpx.HTTPError as error:
            raise RepositoryError("Erro na comunicacao com o Supabase.") from error

        if not response.content:
            return []

        data = response.json()
        return data if isinstance(data, list) else [data]

    def _to_payload(self, product: Product) -> dict[str, str | int | float]:
        return {
            "product_name": product.product_name,
            "quantity_in_stock": product.quantity_in_stock,
            "quantity_sold": product.quantity_sold,
            "unit_price": product.unit_price,
            "revenue": product.revenue,
        }

    def _map_product(self, data: dict) -> Product:
        return Product(
            id=int(data["id"]),
            product_name=str(data["product_name"]),
            quantity_in_stock=int(data["quantity_in_stock"]),
            quantity_sold=int(data["quantity_sold"]),
            unit_price=float(data["unit_price"]),
            revenue=float(data["revenue"]),
        )
