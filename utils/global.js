import countrySymbols from "@/lib/data/countrySymbols";
import currenciesList from "@/lib/data/currenciesList";

export const STYLE_CLASSES = {
  FORM_BASIC_INPUT:
    "mt-1 w-full p-2 shadow-sm border border-gray-300 rounded  focus:border-blue-500 focus:ring focus:ring-blue-200",
  FORM_BASIC_SUBMIT_BUTTON:
    "w-full p-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:from-blue-700 active:to-blue-900 transition-transform transform hover:-translate-y-0.5",
  FORM_BASIC_SUBMIT_BUTTON_DISABLED:
    "w-full p-2 opacity-50 cursor-not-allowed bg-gray-700 hover:bg-gray-600 text-white rounded",
};

export const getCountryCode = (country) => {
  const countrySymbol = countrySymbols[country];
  return countrySymbol || "US";
};

export const getCurrencySymbol = (country) => {
  const countryCode = getCountryCode(country);
  return currenciesList[countryCode] || "USD";
};

export const formatCurrency = (payAmount, country, currencySymbol) => {
  if (!payAmount) return "";

  const amount = (payAmount || 0).toFixed(2);
  const locale = `en-${getCountryCode(country)}`;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencySymbol,
  }).format(amount);
};

export const prettifyDate = (date) => {
  try {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat("en-US").format(dateObj) || "";
  } catch (error) {
    return "";
  }
};

export const reportErrorToServer = async (error, userInfo = null) => {
  const errorInfo = {
    message: error?.message,
    stack: error?.stack,
    user: userInfo,
  };

  await fetch("/api/reportError", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: errorInfo }),
  });
};
