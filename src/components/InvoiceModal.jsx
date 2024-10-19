import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";

const InvoiceModal = ({
  showModal,
  closeModal,
  info,
  items,
  currency,
  subTotal,
  taxAmount,
  discountAmount,
  total,
}) => {
  return (
    <Modal show={showModal} onHide={closeModal} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
          <div className="w-100">
            <h4 className="fw-bold my-2">{info.billFrom || "John Doe"}</h4>
            <h6 className="fw-bold text-secondary mb-1">
              Invoice #: {info.invoiceNumber || ""}
            </h6>
          </div>
          <div className="text-end ms-4">
            <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
            <h5 className="fw-bold text-secondary">
              {" "}
              {currency} {total}
            </h5>
          </div>
        </div>
        <div className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <div className="fw-bold">Billed to:</div>
              <div>{info.billTo || ""}</div>
              <div>{info.billToAddress || ""}</div>
              <div>{info.billToEmail || ""}</div>
            </Col>
            <Col md={4}>
              <div className="fw-bold">Billed From:</div>
              <div>{info.billFrom || ""}</div>
              <div>{info.billFromAddress || ""}</div>
              <div>{info.billFromEmail || ""}</div>
            </Col>
            <Col md={4}>
              <div className="fw-bold mt-2">Date Of Issue:</div>
              <div>{info.dateOfIssue || ""}</div>
            </Col>
          </Row>
          <Table className="mb-0">
            <thead>
              <tr>
                <th>QTY</th>
                <th>DESCRIPTION</th>
                <th className="text-end">PRICE</th>
                <th className="text-end">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: "70px" }}>{item.itemQuantity}</td>
                  <td>
                    {item.itemName} - {item.itemDescription}
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {item.itemPrice}
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {item.itemPrice * item.itemQuantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Table>
            <tbody>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr className="text-end">
                <td></td>
                <td className="fw-bold" style={{ width: "100px" }}>
                  SUBTOTAL
                </td>
                <td className="text-end" style={{ width: "100px" }}>
                  {currency} {subTotal}
                </td>
              </tr>
              {taxAmount !== "0.00" && (
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    TAX
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {taxAmount}
                  </td>
                </tr>
              )}
              {discountAmount !== "0.00" && (
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    DISCOUNT
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {discountAmount}
                  </td>
                </tr>
              )}
              <tr className="text-end">
                <td></td>
                <td className="fw-bold" style={{ width: "100px" }}>
                  TOTAL
                </td>
                <td className="text-end" style={{ width: "100px" }}>
                  {currency} {total}
                </td>
              </tr>
            </tbody>
          </Table>
          {info.notes && (
            <div className="bg-light py-3 px-4 mt-4 rounded">{info.notes}</div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          className="d-block w-100 mt-3 mt-md-0"
          onClick={closeModal}
        >
          <BiPaperPlane
            style={{ width: "16px", height: "16px", marginTop: "-3px" }}
            className="me-2"
          />
          Send Invoice
        </Button>
        <Button
          variant="outline-primary"
          className="d-block w-100 mt-3 mt-md-0"
          onClick={closeModal}
        >
          <BiCloudDownload
            style={{ width: "16px", height: "16px", marginTop: "-3px" }}
            className="me-2"
          />
          Download Copy
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
