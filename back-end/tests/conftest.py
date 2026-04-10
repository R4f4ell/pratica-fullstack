from fastapi.testclient import TestClient
import pytest

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
