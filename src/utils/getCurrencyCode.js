const getCurrencyCode = (currency) => {
  const currencyMap = {
    US$: "USD",
    "£": "GBP",
    "¥": "JPY",
    CA$: "CAD",
    AU$: "AUD",
    SG$: "SGD",
    "CN¥": "CNY",
    "₿": "BTC",
  };
  return currencyMap[currency] || "USD";
};

export default getCurrencyCode;
