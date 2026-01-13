import React, { useState } from "react";
import { productApi } from "../../api/productApi";
import type { ProductStatus } from "../../types/product";
type Props = {
  onCreated: () => void;
  onCancel: () => void;
};

const ProductCreate: React.FC<Props> = ({ onCreated, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState<ProductStatus>("draft");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !price || !sku || !stock) {
      alert("please fill required fields.");
      return;
    }

    const priceNum = Number(price);
    const stockNum = Number(stock);

    if (Number.isNaN(priceNum) || Number.isNaN(stockNum)) {
      alert("price and stock must be numbers.");
      return;
    }

    try {
      setLoading(true);
      await productApi.create({
        name,
        description,
        price: priceNum,
        sku,
        stock: stockNum,
        status,
      });
      alert("product created");
      await onCreated();
    } catch (err: any) {
      alert(err.message || "failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>create product</h2>

      <div>
        <label>
          name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />
        </label>
      </div>

      <div>
        <label>
          description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={input}
          />
        </label>
      </div>

      <div>
        <label>
          price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={input}
          />
        </label>
      </div>

      <div>
        <label>
          sku
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            style={input}
          />
        </label>
      </div>

      <div>
        <label>
          stock
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            style={input}
          />
        </label>
      </div>

      <div>
        <label>
          status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            style={input}
          >
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="blocked">blocked</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={handleCreate} disabled={loading}>
          {loading ? "creating..." : "create"}
        </button>
        <button onClick={onCancel} style={{ marginLeft: 8 }}>
          previous
        </button>
      </div>
    </div>
  );
};

const input: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: 6,
  marginBottom: 8,
};

export default ProductCreate;