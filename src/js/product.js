import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // 1. The issue is not checking if whether the so-cart is exsiting in localstorage
  // 2. cHECK if it is an array, if so, set the items to be empty
  // 3. Push the product selected by the user into the items list.

  let items = getLocalStorage("so-cart");

  if (!Array.isArray(items)) items = [];

  items.push(product);

  setLocalStorage("so-cart", product);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
