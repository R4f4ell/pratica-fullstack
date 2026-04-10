import { useState } from "react";
import "./inventario.scss";
import { mockProducts } from "../utils/mockProducts";

function Inventario() {
  const [searchValue, setSearchValue] = useState("");

  const filteredProducts = mockProducts.filter((product) =>
    product.productName.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div className="inventory-header-left">
          <h1 className="inventory-logo">
            <span className="inventory-logo-icon">▦</span>
            Gerenciamento de Estoque
          </h1>
          <span className="inventory-badge">
            Produtos em estoque <strong>{mockProducts.length}</strong>
          </span>
        </div>

        <div className="inventory-header-right">
          <button className="inventory-button inventory-button-primary" type="button">
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
                      <button className="inventory-button inventory-button-outline-primary" type="button">
                        Editar
                      </button>
                      <button className="inventory-button inventory-button-outline-danger" type="button">
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
          Exibindo <strong>{filteredProducts.length}</strong> de <strong>{mockProducts.length}</strong> produtos
        </footer>
      </main>
    </div>
  );
}

export default Inventario;
