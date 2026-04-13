import os
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("SUPABASE_URL", "http://localhost")
os.environ.setdefault("SUPABASE_KEY", "test-key")
from main import app
from tests.fake_product_repository import ProductRepository
from routers.product_router import get_product_service
from services.product_service import ProductService


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    repository = ProductRepository()
    app.dependency_overrides[get_product_service] = lambda: ProductService(repository)

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
