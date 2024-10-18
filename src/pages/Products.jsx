import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import { BiSolidPencil } from "react-icons/bi";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const products = useSelector((state) => state.products);
  console.log(products);
  const navigate = useNavigate();

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Products</h1>
        <Button onClick={handleGoBack} variant="secondary">
          Go Back
        </Button>
      </div>
      <Button onClick={handleAddProduct} className="mb-3">
        Add New Product
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.description}</td>
              <td>
                <Button
                  variant="outline-primary"
                  onClick={() => handleEditProduct(product)}
                >
                  <BiSolidPencil />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default Products;
