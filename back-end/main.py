from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from routers.product_router import router as product_router

app = FastAPI(title="Estudo Fullstack API")

@app.get("/health")
def read_root():
    return {"message": "Ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)
