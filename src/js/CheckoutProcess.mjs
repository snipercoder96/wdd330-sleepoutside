import { getLocalStorage } from "./utils.mjs";
const baseURL = import.meta.env.VITE_SERVER_URL;

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = []; // contains the items in array[]
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || []; // always return an array
    this.calculateAll();
  }

  calculateItemSubTotal() {
    if (Array.isArray(this.list) && this.list.length > 0) {
      this.itemTotal = this.list.reduce((sum, item) => {
        const qty = Number(item.quantity) || 1;
        return sum + (item.FinalPrice * qty);
      }, 0);
    } else {
      this.itemTotal = 0;
    }

    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    const safeItemTotal = isNaN(this.itemTotal) ? 0 : this.itemTotal;
    this.tax = safeItemTotal * 0.06;
    this.shipping = safeItemTotal > 0 ? 10.00 : 0;
    this.orderTotal = safeItemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  calculateAll() {
    this.calculateItemSubTotal();
    this.calculateOrderTotal();
  }

  async checkout(userData) {
    try {
      const response = await fetch(`${baseURL}checkout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      localStorage.removeItem(this.key);
      alert("Order placed successfully! Thank you for your purchase.");
      window.location.href = "../checkout/success.html?success=true"; // redirect after success
    } catch (err) {
      alert("There was a problem placing your order. Please try again.");
    }
  }

  POSTService() {
    document.querySelector("#checkoutForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const checkoutForm = document.forms[0];
      const chk_status = checkoutForm.checkValidity();
      checkoutForm.reportValidity();

      if (chk_status) {
        document.getElementById("timestamp").value = new Date().toISOString();

        const items = JSON.parse(localStorage.getItem(this.key)) || [];

        if (!items.length) {
          alert("Your cart is empty!");
          return;
        }

        const userData = {
          orderDate: new Date().toISOString(),
          fname: document.querySelector("#fname").value,
          lname: document.querySelector("#lname").value,
          street: document.querySelector("#street").value,
          city: document.querySelector("#city").value,
          state: document.querySelector("#state").value,
          zip: document.querySelector("#zip").value,
          cardNumber: document.querySelector("#cardNumber").value.replace(/\D/g, ""),
          expiration: (() => {
            const exp = document.querySelector("#expiration").value; // must be MM/YY
            const [mm, yy] = exp.split("/");
            return `${mm}/${yy}`;
          })(),
          code: document.querySelector("#code").value,
          items: items.map(item => ({
            id: item.Id,
            name: item.Name || item.Category,
            price: item.FinalPrice,
            quantity: item.quantity || 1
          })),
          orderTotal: this.orderTotal.toFixed(2),
          shipping: this.shipping,
          tax: this.tax.toFixed(2)
        };

        const basicData = {
          ...userData,
          orderDate: document.getElementById("timestamp").value,
          fname: document.querySelector("#fname").value,
          lname: document.querySelector("#lname").value,
          street: document.querySelector("#street").value,
          city: document.querySelector("#city").value,
          state: document.querySelector("#state").value,
          zip: document.querySelector("#zip").value,
        };

        localStorage.setItem("checkout-form", JSON.stringify(basicData));

        this.checkout(userData);
      }
    });
  }
}
