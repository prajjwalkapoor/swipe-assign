import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import generateRandomId from "../utils/generateRandomId";
import getCurrencyCode from "../utils/getCurrencyCode";
import getConvertedCurrencyValue from "../fetchers/getConvertedCurrencyValue";

const ProductSelectionModal = ({
  show,
  handleClose,
  handleProductSelect,
  handleProductEdit,
  handleProductUpdate,
  handleProductAdd,
  editingProduct,
  products,
  currency,
}) => {
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(null);

  useEffect(() => {
    if (editingProduct) {
      setEditForm({
        ...editingProduct,
        price: editingProduct.price.toString(),
      });
    } else {
      setEditForm({ name: "", description: "", price: "" });
    }
  }, [editingProduct]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    handleProductUpdate({
      ...editingProduct,
      ...editForm,
      price: parseFloat(editForm.price),
    });
    setIsAddingProduct(false);
  };

  const handleAddNewProduct = () => {
    setIsAddingProduct(true);
    setEditForm({ name: "", description: "", price: "" });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    handleProductAdd({
      ...editForm,
      price: parseFloat(editForm.price),
      id: generateRandomId(),
    });
    setIsAddingProduct(false);
  };

  const handleProductSelection = async (product) => {
    setLoadingProduct(product.id);
    const toCurrency = getCurrencyCode(currency);
    let finalPrice;

    try {
      const conversionRate = await getConvertedCurrencyValue(toCurrency, "USD");
      finalPrice = parseFloat(product.price) * conversionRate;
      handleProductSelect({
        ...product,
        price: finalPrice,
      });
    } catch (error) {
      console.error("Error converting currency:", error);
      alert("Failed to convert currency. Please try again.");
    } finally {
      setLoadingProduct(null);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editingProduct ? "Edit Product" : "Select a Product"}
        </Modal.Title>
        {!editingProduct && !isAddingProduct && (
          <Button
            variant="success"
            onClick={handleAddNewProduct}
            className="ms-auto"
          >
            Add New Product
          </Button>
        )}
      </Modal.Header>
      <Modal.Body>
        {editingProduct || isAddingProduct ? (
          <Form onSubmit={isAddingProduct ? handleAddSubmit : handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isAddingProduct ? "Add Product" : "Update Product"}
            </Button>
          </Form>
        ) : (
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
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => handleProductSelection(product)}
                      disabled={loadingProduct === product.id}
                    >
                      {loadingProduct === product.id ? "Adding..." : "Select"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleProductEdit(product)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProductSelectionModal;
