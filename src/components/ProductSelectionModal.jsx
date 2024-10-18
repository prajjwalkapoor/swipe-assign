import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

const ProductSelectionModal = ({ show, handleClose, handleProductSelect }) => {
  const products = useSelector((state) => state.products);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select a Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleProductSelect(product)}
                  >
                    Select
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default ProductSelectionModal;
