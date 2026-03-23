import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const dataSource = new ProductData("tents");
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);

product.init().then(() => {
  // Add breadcrumb after nav
  const navbar = document.querySelector(".nav");
  if (navbar && product.product) {
    const breadcrumb = document.createElement("div");
    breadcrumb.className = "breadcrumb";
    const categoryName = "Tents"; // Or get from product data if available
    breadcrumb.textContent = `${categoryName} > ${product.product.NameWithoutBrand}`;
    navbar.insertAdjacentElement("afterend", breadcrumb);
  }
});
