import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.js";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

listing.init().then(() => {
  // Add breadcrumb after nav
  const navbar = document.querySelector(".nav");
  if (navbar) {
    const breadcrumb = document.createElement("div");
    breadcrumb.className = "breadcrumb";
    const categoryName =
      listing.category.charAt(0).toUpperCase() + listing.category.slice(1);
    breadcrumb.textContent = `${categoryName} (${listing.products.length} items)`;
    navbar.insertAdjacentElement("afterend", breadcrumb);
  }
});
