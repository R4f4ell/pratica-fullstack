import { useEffect, useState } from "react";
import "./inventario.scss";
import type { Product, ProductFormData } from "../utils/types";
import ProductModal from "../components/ProductModal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../utils/productApi";

interface ToastState {
  isVisible: boolean;
  type: "success" | "error";
  message: string;
}

function Inventario() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    type: "success",
    message: "",
  });
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const productsFromApi = await fetchProducts();
      setProducts(productsFromApi);
    } catch {
      showToast("error", "Nao foi possivel carregar os produtos.");
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

  async function handleSaveProduct(data: ProductFormData) {
    try {
      if (!data.productName.trim()) {
        throw new Error("Digite o nome do produto.");
      }

      if (modalMode === "edit" && selectedProduct) {
        const updatedProduct = await updateProduct(selectedProduct.id, data);

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === selectedProduct.id ? updatedProduct : product
          )
        );

        showToast("success", "Produto atualizado com sucesso.");
      } else {
        const createdProduct = await createProduct(data);

        setProducts((currentProducts) => [...currentProducts, createdProduct]);

        showToast("success", "Produto criado com sucesso.");
      }

      closeModal();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : modalMode === "edit"
            ? "Nao foi possivel atualizar o produto."
            : "Nao foi possivel criar o produto."
      );
    }
  }

  function openDeleteConfirm(product: Product) {
    setProductToDelete(product);
  }

  function closeDeleteConfirm() {
    setProductToDelete(null);
  }

  async function handleDeleteProduct() {
    try {
      if (!productToDelete) {
        throw new Error();
      }
      await deleteProduct(productToDelete.id);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productToDelete.id)
      );

      closeDeleteConfirm();
      showToast("success", "Produto excluido com sucesso.");
    } catch (error) {
      closeDeleteConfirm();
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Nao foi possivel excluir o produto."
      );
    }
  }

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div className="inventory-header-left">
          <h1 className="inventory-logo">
            <span className="inventory-logo-icon">▦</span>
            Gerenciamento de Estoque
          </h1>
          <span className="inventory-badge">
            Produtos em estoque <strong>{products.length}</strong>
          </span>
        </div>

        <div className="inventory-header-right">
          <button
            className="inventory-button inventory-button-primary"
            type="button"
            onClick={openCreateModal}
          >
            <span className="inventory-button-icon">+</span>
            Add
          </button>

          <div className="inventory-search">
            <input
              className="inventory-search-input"
              type="text"
              placeholder="Buscar produto..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <button className="inventory-search-button" type="button">
              Buscar
            </button>
          </div>
        </div>
      </header>

      <main className="inventory-main">
        <div className="inventory-table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Quantidade em Estoque</th>
                <th>Quantidade Vendida</th>
                <th>Preco Unitário</th>
                <th>Receita</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                  <td className="cell-id">{product.id}</td>
                  <td className="cell-name">{product.productName}</td>
                  <td>{product.quantityInStock.toLocaleString()}</td>
                  <td>{product.quantitySold.toLocaleString()}</td>
                  <td>{product.unitPrice.toLocaleString()}</td>
                  <td className="cell-revenue">{product.revenue.toLocaleString()}</td>
                  <td>
                    <div className="inventory-actions">
                      <button
                        className="inventory-button inventory-button-outline-primary"
                        type="button"
                        onClick={() => openEditModal(product)}
                      >
                        Editar
                      </button>
                      <button
                        className="inventory-button inventory-button-outline-danger"
                        type="button"
                        onClick={() => openDeleteConfirm(product)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="inventory-empty">Nenhum produto encontrado para "{searchValue}"</div>
          )}
        </div>

        <footer className="inventory-footer">
          Exibindo <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> produtos
        </footer>
      </main>

      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialProduct={selectedProduct}
        onClose={closeModal}
        onSave={handleSaveProduct}
      />

      <ConfirmDialog
        isOpen={productToDelete !== null}
        title="Excluir produto"
        description={
          productToDelete
            ? `Tem certeza que deseja excluir "${productToDelete.productName}"?`
            : ""
        }
        confirmLabel="Excluir"
        onConfirm={handleDeleteProduct}
        onCancel={closeDeleteConfirm}
      />

      <Toast
        isVisible={toast.isVisible}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />
    </div>
  );
}

export default Inventario;
