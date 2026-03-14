<<<<<<< HEAD
import { getParam } from "./utils.mjs";
=======
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
>>>>>>> 0b674be5e735bce65e8c311fe8294d956e69a22c
import ProductData from "./ProductData.mjs";
import ProductDetails from './ProductDetails.mjs';

const productId = getParam('product');
const dataSource = new ProductData('tents');

const product = new ProductDetails(productId, dataSource);
product.init();




<<<<<<< HEAD
=======
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
>>>>>>> 0b674be5e735bce65e8c311fe8294d956e69a22c

