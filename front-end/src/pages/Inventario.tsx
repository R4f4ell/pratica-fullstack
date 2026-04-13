import "./inventario.scss";
import { useInventoryController } from "../hooks/useInventoryController";
import ProductModal from "../components/ProductModal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

function Inventario() {
  const {
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
  } = useInventoryController();

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div className="inventory-header-left">
          <h1 className="inventory-logo">
            <span className="inventory-logo-icon">â–¦</span>
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
                <th>Preco UnitÃ¡rio</th>
                <th>Receita</th>
                <th>AÃ§Ãµes</th>
              </tr>
            </thead>

            <tbody>
              {isLoadingProducts
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                      <td className="inventory-skeleton-cell">
                        <div className="inventory-skeleton-line inventory-skeleton-line-id" />
                      </td>
                      <td className="inventory-skeleton-cell">
                        <div className="inventory-skeleton-line inventory-skeleton-line-name" />
                      </td>
                      <td className="inventory-skeleton-cell">
                        <div className="inventory-skeleton-line inventory-skeleton-line-number" />
                      </td>
                      <td className="inventory-skeleton-cell">
                        <div className="inventory-skeleton-line inventory-skeleton-line-number" />
                      </td>
                      <td className="inventory-skeleton-cell">
                        <div className="inventory-skeleton-line inventory-skeleton-line-number" />
                      </td>
                      <td className="inventory-skeleton-cell">
                        <div className="inventory-skeleton-line inventory-skeleton-line-number" />
                      </td>
                      <td className="inventory-skeleton-cell">
                        <div className="inventory-skeleton-line inventory-skeleton-line-action" />
                      </td>
                    </tr>
                  ))
                : products.map((product, index) => (
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

          {!isLoadingProducts && products.length === 0 && (
            <div className="inventory-empty">
              {!searchValue.trim()
                ? "Sua lista de produtos ainda estÃ¡ vazia"
                : `Nenhum resultado encontrado para "${searchValue}"`}
            </div>
          )}
        </div>

        {!isLoadingProducts && products.length > 0 && (
          <footer className="inventory-footer">
            Exibindo <strong>{products.length}</strong> produtos
          </footer>
        )}
      </main>

      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialProduct={selectedProduct}
        onClose={closeModal}
        onSave={handleSaveProduct}
        isSubmitting={isSavingProduct}
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
        isSubmitting={isDeletingProduct}
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
