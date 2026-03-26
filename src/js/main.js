import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.js";

loadHeaderFooter();

const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const listing = new ProductList("tents", dataSource, element);

// adding feature search
async function init() {
  await listing.init();

  const navbar = document.querySelector(".nav");
  if (navbar) {
    const breadcrumb = document.createElement("div");
    breadcrumb.className = "breadcrumb";
    // Capitalize the category name
    const categoryName =
      listing.category.charAt(0).toUpperCase() + listing.category.slice(1);
    breadcrumb.textContent = `${categoryName} (${listing.products.length} items)`;
    navbar.insertAdjacentElement("afterend", breadcrumb);
  }
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length === 0) {
      listing.renderList(listing.products || []);
      return;
    }
    if (query.length < 3) return;
    const filtered = (listing.products || []).filter((product) =>
      product.Name.toLowerCase().includes(query),
    );
    listing.renderList(filtered);
  });
}

init();
