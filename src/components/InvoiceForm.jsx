import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import { BiArrowBack } from "react-icons/bi";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import { addInvoice, updateInvoice } from "../redux/invoicesSlice";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import generateRandomId from "../utils/generateRandomId";
import { useInvoiceListData } from "../redux/hooks";
import ProductSelectionModal from "./ProductSelectionModal";
import { updateProduct, addProduct } from "../redux/productsSlice";
import getCurrencyCode from "../utils/getCurrencyCode";
import getConvertedCurrencyValue from "../fetchers/getConvertedCurrencyValue";
import { Spinner } from "react-bootstrap";

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCopy = location.pathname.includes("create");
  const isEdit = location.pathname.includes("edit");

  const [isOpen, setIsOpen] = useState(false);
  const [copyId, setCopyId] = useState("");
  const { getOneInvoice, listSize } = useInvoiceListData();
  const [formData, setFormData] = useState({
    id: generateRandomId(),
    currentDate: new Date().toLocaleDateString(),
    invoiceNumber: listSize + 1,
    dateOfIssue: "",
    billTo: "",
    billToEmail: "",
    billToAddress: "",
    billFrom: "",
    billFromEmail: "",
    billFromAddress: "",
    notes: "",
    total: "0.00",
    subTotal: "0.00",
    taxRate: "",
    taxAmount: "0.00",
    discountRate: "",
    discountAmount: "0.00",
    currency: "US$",
    items: [],
  });

  const [loading, setLoading] = useState(true);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const products = useSelector((state) => state.products);

  useEffect(() => {
    const fetchInvoiceData = () => {
      if (isEdit || (isCopy && params.id)) {
        try {
          const invoiceData = getOneInvoice(params.id);
          if (invoiceData) {
            setFormData((_) => ({
              ...invoiceData,
              id: isCopy ? generateRandomId() : invoiceData.id,
              invoiceNumber: isCopy ? listSize + 1 : invoiceData.invoiceNumber,
            }));
          } else {
            console.error("Invoice not found");
          }
        } catch (error) {
          console.error("Error fetching invoice:", error);
        }
      }
      setLoading(false);
    };

    fetchInvoiceData();
  }, []);

  useEffect(() => {
    handleCalculateTotal();
  }, []);

  const handleRowDel = (itemToDelete) => {
    const updatedItems = formData.items.filter(
      (item) => item.itemId !== itemToDelete.itemId
    );
    setFormData({ ...formData, items: updatedItems });
    handleCalculateTotal();
  };

  const handleAddEvent = () => {
    setShowProductModal(true);
  };

  const handleProductSelect = (product) => {
    const existingItem = formData.items.find(
      (item) => item.itemName === product.name
    );

    if (existingItem) {
      alert(
        "This product is already in the invoice. Please modify its quantity instead."
      );
      return;
    }

    const newItem = {
      id: product.id,
      itemName: product.name,
      itemDescription: product.description,
      itemPrice: Number(product.price),
      itemQuantity: 1,
    };

    setFormData((prevState) => {
      const updatedItems = [...prevState.items, newItem];
      return {
        ...prevState,
        items: updatedItems,
      };
    });

    setShowProductModal(false);

    setTimeout(() => handleCalculateTotal(), 0);
  };

  const handleCalculateTotal = () => {
    setFormData((prevFormData) => {
      let subTotal = 0;

      prevFormData.items.forEach((item) => {
        subTotal += parseFloat(item.itemPrice) * parseInt(item.itemQuantity);
      });

      const taxAmount = parseFloat(
        subTotal * (prevFormData.taxRate / 100)
      ).toFixed(2);
      const discountAmount = parseFloat(
        subTotal * (prevFormData.discountRate / 100)
      ).toFixed(2);
      const total = (
        subTotal -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);

      return {
        ...prevFormData,
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total,
      };
    });
  };

  const onItemizedItemEdit = (evt, id) => {
    const updatedItems = formData.items.map((oldItem) => {
      if (oldItem.id === id) {
        return { ...oldItem, [evt.target.name]: evt.target.value };
      }
      return oldItem;
    });

    setFormData({ ...formData, items: updatedItems });
    handleCalculateTotal();
  };

  const editField = (name, value) => {
    setFormData({ ...formData, [name]: value });
    handleCalculateTotal();
  };

  const onCurrencyChange = (selectedOption) => {
    handleCurrencyConversion(selectedOption.currency, formData.currency);
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddInvoice = () => {
    handleCalculateTotal();

    const invoiceData = {
      ...formData,
      currency: formData.currency,
      currentDate: formData.currentDate,
      invoiceNumber: formData.invoiceNumber,
      dateOfIssue: formData.dateOfIssue,
      billTo: formData.billTo,
      billToEmail: formData.billToEmail,
      billToAddress: formData.billToAddress,
      billFrom: formData.billFrom,
      billFromEmail: formData.billFromEmail,
      billFromAddress: formData.billFromAddress,
      notes: formData.notes,
      total: formData.total,
      subTotal: formData.subTotal,
      taxRate: formData.taxRate,
      taxAmount: formData.taxAmount,
      discountRate: formData.discountRate,
      discountAmount: formData.discountAmount,
      items: formData.items,
    };

    if (isEdit) {
      dispatch(updateInvoice({ ...invoiceData, id: params.id }));
      alert("Invoice updated successfully 🥳");
    } else if (isCopy) {
      dispatch(addInvoice({ ...invoiceData, id: generateRandomId() }));
      alert("Invoice added successfully 🥳");
    } else {
      dispatch(addInvoice(invoiceData));
      alert("Invoice added successfully 🥳");
    }
    navigate("/");
  };

  const handleCopyInvoice = () => {
    try {
      const receivedInvoice = getOneInvoice(copyId);
      if (receivedInvoice) {
        setFormData({
          ...receivedInvoice,
          id: generateRandomId(),
          invoiceNumber: listSize + 1,
        });
      } else {
        alert("Invoice does not exist!");
      }
    } catch (error) {
      console.error("Error copying invoice:", error);
      alert("An error occurred while copying the invoice. Please try again.");
    }
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleProductUpdate = (updatedProduct) => {
    dispatch(updateProduct(updatedProduct));
    setEditingProduct(null);

    const updatedItems = formData.items.map((item) =>
      item.id === updatedProduct.id
        ? {
            ...item,
            itemName: updatedProduct.name,
            itemPrice: updatedProduct.price,
          }
        : item
    );
    setFormData((prevState) => ({ ...prevState, items: updatedItems }));
    handleCalculateTotal();
  };

  const handleProductAdd = async (newProduct) => {
    const toCurrency = getCurrencyCode(formData.currency);
    if (toCurrency !== "USD") {
      const conversionRate = await getConvertedCurrencyValue(toCurrency, "USD");
      newProduct.price = (newProduct.price * conversionRate).toFixed(2);
    }

    dispatch(addProduct(newProduct));
    setEditingProduct(null);
    handleProductSelect(newProduct);
  };

  const handleCurrencyConversion = async (currency, prevCurrency) => {
    const prevCurCode = getCurrencyCode(prevCurrency);
    const curCode = getCurrencyCode(currency);
    const convertedCurrencyValue = await getConvertedCurrencyValue(
      curCode,
      prevCurCode
    );
    const updatedItems = formData.items.map((item) => ({
      ...item,
      itemPrice: (Number(item.itemPrice) * convertedCurrencyValue).toFixed(2),
    }));
    setFormData((prevState) => ({
      ...prevState,
      currency: currency,
      items: updatedItems,
      total: (Number(prevState.total) * convertedCurrencyValue).toFixed(2),
      subTotal: (Number(prevState.subTotal) * convertedCurrencyValue).toFixed(
        2
      ),
      taxAmount: (Number(prevState.taxAmount) * convertedCurrencyValue).toFixed(
        2
      ),
      discountAmount: (
        Number(prevState.discountAmount) * convertedCurrencyValue
      ).toFixed(2),
    }));
  };

  if (loading) {
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>;
  }

  return (
    <Form>
      <div className="d-flex align-items-center">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
          <Link to="/">
            <h5>Go Back</h5>
          </Link>
        </div>
      </div>

      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{formData.currentDate}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control
                    type="date"
                    value={formData.dateOfIssue}
                    name="dateOfIssue"
                    onChange={(e) => editField(e.target.name, e.target.value)}
                    style={{ maxWidth: "150px" }}
                    required
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control
                  type="number"
                  value={formData.invoiceNumber}
                  name="invoiceNumber"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  min="1"
                  style={{ maxWidth: "70px" }}
                  required
                />
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control
                  placeholder="Who is this invoice to?"
                  rows={3}
                  value={formData.billTo}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
                <Form.Control
                  placeholder="Email address"
                  value={formData.billToEmail}
                  type="email"
                  name="billToEmail"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="email"
                  required
                />
                <Form.Control
                  placeholder="Billing address"
                  value={formData.billToAddress}
                  type="text"
                  name="billToAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control
                  placeholder="Who is this invoice from?"
                  rows={3}
                  value={formData.billFrom}
                  type="text"
                  name="billFrom"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="name"
                  required
                />
                <Form.Control
                  placeholder="Email address"
                  value={formData.billFromEmail}
                  type="email"
                  name="billFromEmail"
                  className="my-2"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  autoComplete="email"
                  required
                />
                <Form.Control
                  placeholder="Billing address"
                  value={formData.billFromAddress}
                  type="text"
                  name="billFromAddress"
                  className="my-2"
                  autoComplete="address"
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  required
                />
              </Col>
            </Row>
            <InvoiceItem
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={formData.currency}
              items={formData.items}
            />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {formData.currency}
                    {formData.subTotal}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small">
                      ({formData.discountRate || 0}%)
                    </span>
                    {formData.currency}
                    {formData.discountAmount || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small">({formData.taxRate || 0}%)</span>
                    {formData.currency}
                    {formData.taxAmount || 0}
                  </span>
                </div>
                <hr />
                <div
                  className="d-flex flex-row align-items-start justify-content-between"
                  style={{ fontSize: "1.125rem" }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    {formData.currency}
                    {formData.total || 0}
                  </span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Thanks for your business!"
              name="notes"
              value={formData.notes}
              onChange={(e) => editField(e.target.name, e.target.value)}
              as="textarea"
              className="my-2"
              rows={1}
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button
              variant="dark"
              onClick={handleAddInvoice}
              className="d-block w-100 mb-2"
            >
              {isEdit ? "Update Invoice" : "Add Invoice"}
            </Button>
            <Button
              variant="primary"
              onClick={openModal}
              className="d-block w-100"
            >
              Review Invoice
            </Button>
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              info={{
                isOpen,
                id: formData.id,
                currency: formData.currency,
                currentDate: formData.currentDate,
                invoiceNumber: formData.invoiceNumber,
                dateOfIssue: formData.dateOfIssue,
                billTo: formData.billTo,
                billToEmail: formData.billToEmail,
                billToAddress: formData.billToAddress,
                billFrom: formData.billFrom,
                billFromEmail: formData.billFromEmail,
                billFromAddress: formData.billFromAddress,
                notes: formData.notes,
                total: formData.total,
                subTotal: formData.subTotal,
                taxRate: formData.taxRate,
                taxAmount: formData.taxAmount,
                discountRate: formData.discountRate,
                discountAmount: formData.discountAmount,
              }}
              items={formData.items}
              currency={formData.currency}
              subTotal={formData.subTotal}
              taxAmount={formData.taxAmount}
              discountAmount={formData.discountAmount}
              total={formData.total}
            />
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(event) =>
                  onCurrencyChange({ currency: event.target.value })
                }
                className="btn btn-light my-1"
                aria-label="Change Currency"
                value={formData.currency}
              >
                <option value="US$">USD (United States Dollar)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="CA$">CAD (Canadian Dollar)</option>
                <option value="AU$">AUD (Australian Dollar)</option>
                <option value="SG$">SGD (Singapore Dollar)</option>
                <option value="CN¥">CNY (Chinese Renminbi)</option>
                <option value="₿">BTC (Bitcoin)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={formData.discountRate}
                  onChange={(e) => editField(e.target.name, e.target.value)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Control
              placeholder="Enter Invoice ID"
              name="copyId"
              value={copyId}
              onChange={(e) => setCopyId(e.target.value)}
              type="text"
              className="my-2 bg-white border"
            />
            <Button
              variant="primary"
              onClick={handleCopyInvoice}
              className="d-block"
            >
              Copy Old Invoice
            </Button>
          </div>
        </Col>
      </Row>

      <ProductSelectionModal
        show={showProductModal}
        handleClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        handleProductSelect={handleProductSelect}
        handleProductEdit={handleProductEdit}
        handleProductUpdate={handleProductUpdate}
        handleProductAdd={handleProductAdd}
        editingProduct={editingProduct}
        products={products}
        currency={formData.currency}
      />
    </Form>
  );
};

export default InvoiceForm;
