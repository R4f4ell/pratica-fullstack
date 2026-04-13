import { useEffect, useState } from "react";
import "./productModal.scss";
import type { Product, ProductFormData } from "../utils/types";

interface ProductModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialProduct: Product | null;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

const emptyForm: ProductFormData = {
  productName: "",
  quantityInStock: "",
  quantitySold: "",
  unitPrice: "",
};

function ProductModal({
  isOpen,
  mode,
  initialProduct,
  onClose,
  onSave,
  isSubmitting = false,
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && initialProduct) {
      setFormData({
        productName: initialProduct.productName,
        quantityInStock: String(initialProduct.quantityInStock),
        quantitySold: String(initialProduct.quantitySold),
        unitPrice: String(initialProduct.unitPrice),
      });
      return;
    }

    setFormData(emptyForm);
  }, [initialProduct, isOpen, mode]);

  if (!isOpen) {
    return null;
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSave(formData);
  }

  const estimatedRevenue =
    (Number(formData.quantitySold) || 0) * (Number(formData.unitPrice) || 0);

  return (
    <div
      className="product-modal-overlay"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="product-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="product-modal-header">
          <div>
            <h2 className="product-modal-title">
              {mode === "create" ? "Novo produto" : "Editar produto"}
            </h2>
            <p className="product-modal-subtitle">
              Preencha os campos para simular a ação na interface.
            </p>
          </div>

          <button
            className="product-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form className="product-modal-form" onSubmit={handleSubmit}>
          <label className="product-modal-field">
            <span>Nome do produto</span>
            <input
              name="productName"
              type="text"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Digite o nome do produto"
              disabled={isSubmitting}
            />
          </label>

          <div className="product-modal-grid">
            <label className="product-modal-field">
              <span>Quantidade em estoque</span>
              <input
                name="quantityInStock"
                type="number"
                min="0"
                value={formData.quantityInStock}
                onChange={handleChange}
                placeholder="0"
                disabled={isSubmitting}
              />
            </label>

            <label className="product-modal-field">
              <span>Quantidade vendida</span>
              <input
                name="quantitySold"
                type="number"
                min="0"
                value={formData.quantitySold}
                onChange={handleChange}
                placeholder="0"
                disabled={isSubmitting}
              />
            </label>
          </div>

          <label className="product-modal-field">
            <span>Preço unitário</span>
            <input
              name="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </label>

          <div className="product-modal-preview">
            Receita estimada: <strong>{estimatedRevenue.toLocaleString()}</strong>
          </div>

          <div className="product-modal-actions">
            <button
              className="product-modal-button product-modal-button-secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              className="product-modal-button product-modal-button-primary"
              type="submit"
              disabled={isSubmitting}
              aria-label={mode === "create" ? "Salvando produto" : "Salvando alteracoes"}
            >
              {isSubmitting ? <span className="product-modal-spinner" /> : mode === "create" ? "Salvar produto" : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
