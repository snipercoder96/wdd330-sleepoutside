import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // 1. The fix needed: Set it empty if not found, then add the items
  let items = getLocalStorage("so-cart");

  if (!Array.isArray(items)) {
    items = [];
  }

  items.push(product);

  setLocalStorage("so-cart", items);
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
