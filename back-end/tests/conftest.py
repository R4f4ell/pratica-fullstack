import os

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("SUPABASE_URL", "http://localhost")
os.environ.setdefault("SUPABASE_KEY", "test-key")
from main import app
from repositories.product_repository import ProductRepository
from routers import product_router
from services.product_service import ProductService


@pytest.fixture
def client() -> TestClient:
    repository = ProductRepository()
    product_router.product_repository = repository
    product_router.product_service = ProductService(repository)
    return TestClient(app)
