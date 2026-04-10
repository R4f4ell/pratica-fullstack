def test_healthcheck_returns_ok(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"message": "Ok"}


def test_list_products_returns_seed_data(client):
    response = client.get("/products/")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 4
    assert data[0]["product_name"] == "Leite"


def test_list_products_filters_by_search(client):
    response = client.get("/products/", params={"search": "lar"})

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    assert all(product["product_name"] == "Laranja" for product in data)


def test_get_product_by_id_returns_product(client):
    response = client.get("/products/23")

    assert response.status_code == 200
    assert response.json()["id"] == 23


def test_get_product_by_id_returns_404_when_not_found(client):
    response = client.get("/products/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Produto nao encontrado."}


def test_create_product_returns_created_product_with_calculated_revenue(client):
    payload = {
        "product_name": "Cafe",
        "quantity_in_stock": 50,
        "quantity_sold": 10,
        "unit_price": 25.5,
    }

    response = client.post("/products/", json=payload)

    assert response.status_code == 201
    data = response.json()

    assert data["id"] == 27
    assert data["product_name"] == "Cafe"
    assert data["revenue"] == 255.0


def test_create_product_returns_400_when_quantity_sold_is_greater_than_stock(client):
    payload = {
        "product_name": "Cafe",
        "quantity_in_stock": 5,
        "quantity_sold": 10,
        "unit_price": 25.5,
    }

    response = client.post("/products/", json=payload)

    assert response.status_code == 400
    assert response.json() == {
        "detail": "A quantidade vendida nao pode ser maior que a quantidade em estoque."
    }


def test_update_product_returns_updated_product(client):
    payload = {
        "product_name": "Leite Integral",
        "quantity_in_stock": 300,
        "quantity_sold": 40,
        "unit_price": 12.5,
    }

    response = client.put("/products/23", json=payload)

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == 23
    assert data["product_name"] == "Leite Integral"
    assert data["revenue"] == 500.0


def test_update_product_returns_404_when_not_found(client):
    payload = {
        "product_name": "Leite Integral",
        "quantity_in_stock": 300,
        "quantity_sold": 40,
        "unit_price": 12.5,
    }

    response = client.put("/products/999", json=payload)

    assert response.status_code == 404
    assert response.json() == {"detail": "Produto nao encontrado."}


def test_delete_product_removes_product(client):
    response = client.delete("/products/23")

    assert response.status_code == 200
    assert response.json() == {"message": "Produto removido com sucesso."}

    list_response = client.get("/products/")
    assert len(list_response.json()) == 3


def test_delete_product_returns_404_when_not_found(client):
    response = client.delete("/products/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Produto nao encontrado."}
