from fastapi import FastAPI

app = FastAPI(title="Estudo Fullstack API")


@app.get("/health")
def read_root():
    return {"message": "Ok"}
