import { useEffect, useState } from "react";

import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../utils/productApi";
import type { Product, ProductFormData } from "../utils/types";

export interface ToastState {
  isVisible: boolean;
  type: "success" | "error";
  message: string;
}

const REQUIRED_FIELDS_MESSAGE = "Todos os campos devem ser preenchidos!";

export function useInventoryController() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    type: "success",
    message: "",
  });
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    void loadProducts(debouncedSearchValue);
  }, [debouncedSearchValue]);

  async function loadProducts(search?: string) {
    setIsLoadingProducts(true);
    try {
      const productsFromApi = await fetchProducts(search);
      setProducts(productsFromApi);
    } catch {
      showToast("error", "Nao foi possivel carregar os produtos.");
    } finally {
      setIsLoadingProducts(false);
    }
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedProduct(null);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setModalMode("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSavingProduct) {
      return;
    }

    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  function showToast(type: "success" | "error", message: string) {
    setToast({
      isVisible: true,
      type,
      message,
    });
  }

  function closeToast() {
    setToast((currentToast) => ({
      ...currentToast,
      isVisible: false,
    }));
  }

  function hasEmptyRequiredFields(data: ProductFormData) {
    return (
      !data.productName.trim() ||
      !data.quantityInStock.trim() ||
      !data.quantitySold.trim() ||
      !data.unitPrice.trim()
    );
  }

  async function handleSaveProduct(data: ProductFormData) {
    if (isSavingProduct) {
      return;
    }

    setIsSavingProduct(true);
    try {
      if (hasEmptyRequiredFields(data)) {
        throw new Error(REQUIRED_FIELDS_MESSAGE);
      }

      if (modalMode === "edit" && selectedProduct) {
        await updateProduct(selectedProduct.id, data);
        await loadProducts(searchValue);

        showToast("success", "Produto atualizado com sucesso!");
      } else {
        await createProduct(data);
        await loadProducts(searchValue);

        showToast("success", "Produto criado com sucesso!");
      }

      closeModal();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : modalMode === "edit"
            ? "Nao foi possivel atualizar o produto"
            : "Nao foi possivel criar o produto"
      );
    } finally {
      setIsSavingProduct(false);
    }
  }

  function openDeleteConfirm(product: Product) {
    setProductToDelete(product);
  }

  function closeDeleteConfirm() {
    if (isDeletingProduct) {
      return;
    }

    setProductToDelete(null);
  }

  async function handleDeleteProduct() {
    if (isDeletingProduct) {
      return;
    }

    setIsDeletingProduct(true);
    try {
      if (!productToDelete) {
        throw new Error();
      }

      await deleteProduct(productToDelete.id);
      await loadProducts(searchValue);

      closeDeleteConfirm();
      showToast("success", "Produto excluido com sucesso!");
    } catch (error) {
      closeDeleteConfirm();
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Nao foi possivel excluir o produto"
      );
    } finally {
      setIsDeletingProduct(false);
    }
  }

  return {
    products,
    searchValue,
    setSearchValue,
    isLoadingProducts,
    isSavingProduct,
    isDeletingProduct,
    isModalOpen,
    modalMode,
    selectedProduct,
    toast,
    productToDelete,
    openCreateModal,
    openEditModal,
    closeModal,
    closeToast,
    handleSaveProduct,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleDeleteProduct,
  };
}
