import { useSelector } from "react-redux";
import { selectInvoiceList } from "./invoicesSlice";
export const useInvoiceListData = () => {
  const invoiceList = useSelector(selectInvoiceList);
  const products = useSelector((state) => state.products);
  const getOneInvoice = (receivedId) => {
    const invoice = invoiceList.find(
      (invoice) => invoice.id.toString() === receivedId.toString()
    );
    const updatedItems = invoice.items.map((item) => {
      const product = products.find((product) => product.id === item.id);
      return {
        id: item.id,
        itemName: product.name,
        itemDescription: product.description,
        itemPrice: item.itemPrice,
        itemQuantity: item.itemQuantity,
      };
    });
    return { ...invoice, items: updatedItems };
  };

  const listSize = invoiceList.length;

  return {
    invoiceList,
    getOneInvoice,
    listSize,
  };
};
