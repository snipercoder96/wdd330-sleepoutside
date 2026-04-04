import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.js";

loadHeaderFooter();

const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const listing = new ProductList("tents", dataSource, element);


async function init() {
  await listing.init();

  const navbar = document.querySelector(".nav");
  if (navbar) {
    const breadcrumb = document.createElement("div");
    breadcrumb.className = "breadcrumb";
    
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

const subscribeBtn = document.getElementById("subscribeBtn");
const modal = document.getElementById("newsletterModal");
const closeBtn = document.querySelector(".close-btn");
const form = document.getElementById("newsletterForm");
const successMessage = document.getElementById("successMessage");


subscribeBtn.addEventListener("click", () => {
  modal.style.display = "block";
});


closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});


window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("emailInput").value;

  
  console.log("Email submitted:", email);

  form.style.display = "none";
  successMessage.style.display = "block";
});
init();
