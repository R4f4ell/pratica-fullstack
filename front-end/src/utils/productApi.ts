import type { Product } from "./types";

interface ApiProduct {
  id: number;
  product_name: string;
  quantity_in_stock: number;
  quantity_sold: number;
  unit_price: number;
  revenue: number;
}

interface ProductInput {
  product_name: string;
  quantity_in_stock: number;
  quantity_sold: number;
  unit_price: number;
}

const API_BASE_URL = "http://localhost:8000";

function toProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id,
    productName: apiProduct.product_name,
    quantityInStock: apiProduct.quantity_in_stock,
    quantitySold: apiProduct.quantity_sold,
    unitPrice: apiProduct.unit_price,
    revenue: apiProduct.revenue,
  };
}

function toProductInput(product: {
  productName: string;
  quantityInStock: string;
  quantitySold: string;
  unitPrice: string;
}): ProductInput {
  return {
    product_name: product.productName.trim(),
    quantity_in_stock: Number(product.quantityInStock) || 0,
    quantity_sold: Number(product.quantitySold) || 0,
    unit_price: Number(product.unitPrice) || 0,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Nao foi possivel processar a requisicao.";

    try {
      const data = await response.json();
      if (typeof data?.detail === "string" && data.detail.trim()) {
        message = data.detail;
      }
    } catch {
      message = "Nao foi possivel processar a requisicao.";
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/`);
  const data = await handleResponse<ApiProduct[]>(response);
  return data.map(toProduct);
}

export async function createProduct(product: {
  productName: string;
  quantityInStock: string;
  quantitySold: string;
  unitPrice: string;
}): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toProductInput(product)),
  });

  const data = await handleResponse<ApiProduct>(response);
  return toProduct(data);
}

export async function updateProduct(
  productId: number,
  product: {
    productName: string;
    quantityInStock: string;
    quantitySold: string;
    unitPrice: string;
  }
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toProductInput(product)),
  });

  const data = await handleResponse<ApiProduct>(response);
  return toProduct(data);
}

export async function deleteProduct(productId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
  });

  await handleResponse<{ message: string }>(response);
}
