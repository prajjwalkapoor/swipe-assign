import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addProduct, editProduct } from "../redux/productsSlice";
import generateRandomId from "../utils/generateRandomId";

const ProductModal = ({ show, onHide, onSubmit, editingProduct = null }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price.toString());
      setDescription(editingProduct.description);
    } else {
      setName("");
      setPrice("");
      setDescription("");
    }
  }, [editingProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name,
      price: parseFloat(price),
      description,
    };

    if (editingProduct) {
      dispatch(editProduct({ ...productData, id: editingProduct.id }));
    } else {
      dispatch(addProduct({ ...productData, id: generateRandomId() }));
    }

    onSubmit();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingProduct ? "Edit Product" : "Add New Product"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {editingProduct ? "Save Changes" : "Add Product"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
