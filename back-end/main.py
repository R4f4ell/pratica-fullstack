from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.product_router import router as product_router

app = FastAPI(title="Estudo Fullstack API")

@app.get("/health")
def read_root():
    return {"message": "Ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)

