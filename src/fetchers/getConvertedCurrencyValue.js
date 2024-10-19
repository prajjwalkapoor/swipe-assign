import Freecurrencyapi from "@everapi/freecurrencyapi-js";

const freecurrencyapi = new Freecurrencyapi(
  process.env.REACT_APP_FREECURRENCYAPI_API_KEY
);
const getConvertedCurrencyValue = async (currency, baseCurrency) => {
  const conversion = await freecurrencyapi.latest({
    base_currency: baseCurrency,
    currencies: [currency],
  });
  return conversion.data[currency];
};

export default getConvertedCurrencyValue;
