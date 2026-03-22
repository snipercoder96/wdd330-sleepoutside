import { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.js";

loadHeaderFooter();

const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const listing = new ProductList("tents", dataSource, element);

listing.init();