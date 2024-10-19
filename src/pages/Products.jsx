import React, { useState, useCallback } from "react";
import { Button, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import ProductModal from "../components/ProductModal";

const Products = () => {
  const products = useSelector((state) => state.products);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingProduct(null);
  }, []);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  return (
    <div>
      <h1>Products</h1>
      <Button onClick={() => handleOpenModal()}>Add Product</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>
                <Button onClick={() => handleOpenModal(product)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ProductModal
        show={showModal}
        onClose={handleCloseModal}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default Products;
