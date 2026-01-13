import React from "react";
import type {Product } from "../../types/product";

type Props = {
  products: Product[];
  loading: boolean;
  onCreateClick: () => void;
  onUpdateClick: (product: Product) => void;
};

const ProductDashboard: React.FC<Props> = ({
  products,
  loading,
  onCreateClick,
  onUpdateClick,
}) => {
  return (
    <div style={{ padding: 16 }}>
      <h2>product dashboard</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={onCreateClick}>create</button>
      </div>

      {loading && <p>loading...</p>}
      {/* {(() => { console.log('This is a log inside return'); return null; })()} */}
      {!loading && products.length > 0 && (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={th}>id</th>
              <th style={th}>name</th>
              <th style={th}>description</th>
              <th style={th}>price</th>
              <th style={th}>sku</th>
              <th style={th}>stock</th>
              <th style={th}>status</th>
              <th style={th}>action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={td}>{p.id}</td>
                <td style={td}>{p.name}</td>
                <td style={td}>{p.description}</td>
                <td style={td}>{p.price}</td>
                <td style={td}>{p.sku}</td>
                <td style={td}>{p.stock}</td>
                <td style={td}>{p.status}</td>
                <td style={td}>
                  <button onClick={() => onUpdateClick(p)}>update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const th: React.CSSProperties = { border: "1px solid #ccc", padding: 8 };
const td: React.CSSProperties = { border: "1px solid #ccc", padding: 8 };

export default ProductDashboard;