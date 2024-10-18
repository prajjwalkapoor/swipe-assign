import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import EditableField from "./EditableField";

const InvoiceItem = (props) => {
  const { onItemizedItemEdit, currency, onRowDel, items, onRowAdd } = props;
  console.log("items", items);
  const itemTable = items.map((item) => (
    <ItemRow
      key={item.id}
      item={item}
      onDelEvent={onRowDel}
      onItemizedItemEdit={onItemizedItemEdit}
      currency={currency}
    />
  ));

  return (
    <div>
      <h6>Invoice Items</h6>
      {items.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>ITEM</th>
              <th>QTY</th>
              <th>PRICE/RATE</th>
              <th className="text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>{itemTable}</tbody>
        </Table>
      ) : (
        <div className="alert alert-info" role="alert">
          No items added
        </div>
      )}

      <Button className="fw-bold" onClick={onRowAdd}>
        Add Item
      </Button>
    </div>
  );
};

const ItemRow = (props) => {
  const onDelEvent = () => {
    props.onDelEvent(props.item);
  };

  // Convert itemPrice to a number and use toFixed()
  const formattedPrice = Number(props.item.itemPrice).toFixed(2);

  return (
    <tr>
      <td style={{ width: "100%" }}>
        <span>{props.item.itemName}</span>
        <br />
        <small>{props.item.itemDescription}</small>
      </td>
      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={(evt) =>
            props.onItemizedItemEdit(evt, props.item.id)
          }
          cellData={{
            type: "number",
            name: "itemQuantity",
            min: 1,
            step: "1",
            value: props.item.itemQuantity,
            id: props.item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "130px" }}>
        <span>
          {props.currency} {formattedPrice}
        </span>
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiTrash
          onClick={onDelEvent}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
      </td>
    </tr>
  );
};

export default InvoiceItem;
