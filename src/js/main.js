import { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.js";

loadHeaderFooter();

const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const listing = new ProductList("tents", dataSource, element);

await listing.init();

// adding feature search
document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  if (query.length === 0) {
    // make sure that the query is not empty
    listing.renderList(listing.products || []);
    return;
  }
  if (query.length < 3) return; // if its less than 3 dont reutrn any resut because there wil be no filtering happening if characters are not at least 3
  const filtered = (listing.products || []).filter((product) =>
    product.Name.toLowerCase().includes(query),
  );
  listing.renderList(filtered);
});
