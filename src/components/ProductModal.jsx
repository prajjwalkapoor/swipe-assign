import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../redux/productsSlice";

const ProductModal = ({ show, onClose, editingProduct }) => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(
    editingProduct || { name: "", description: "", price: "" }
  );

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct);
    } else {
      setProduct({ name: "", description: "", price: "" });
    }
  }, [editingProduct, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      dispatch(updateProduct({ ...editingProduct, ...product }));
    } else {
      dispatch(addProduct({ ...product, id: Date.now() }));
    }
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingProduct ? "Edit Product" : "Add Product"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: parseFloat(e.target.value) })
              }
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {editingProduct ? "Update" : "Add"} Product
          </Button>
          <Button variant="secondary" onClick={onClose} className="ms-2">
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
