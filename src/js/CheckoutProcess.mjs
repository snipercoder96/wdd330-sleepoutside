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
    this.list = getLocalStorage(this.key);
    this.calculateAll();
  }

  calculateItemSubTotal() {

    if (Array.isArray(this.list) && this.list.length > 0) {
      this.itemTotal = this.list.reduce((sum, item) => {
        return sum + (item.FinalPrice * item.quantity);
      }, 0);
    } else {
      this.itemTotal = 0;
    }

    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // Guard against NaN by ensuring itemTotal is a number and not null
    const safeItemTotal = isNaN(this.itemTotal) ? 0 : this.itemTotal;

    this.tax = safeItemTotal * 0.06;
    this.shipping = safeItemTotal > 0 ? 10.00 : 0; // only charge shipping if items exist
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

  POSTService() {
    document.querySelector("#checkoutForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      // Set timestamp at the moment of submission
      document.getElementById("timestamp").value = new Date().toISOString().split("T")[0];

      const userData = {
        orderDate: document.getElementById("timestamp").value,
        fname: document.querySelector("#fname").value,
        lname: document.querySelector("#lname").value,
        street: document.querySelector("#street").value,
        city: document.querySelector("#city").value,
        state: document.querySelector("#state").value,
        zip: document.querySelector("#zip").value,
        cardNumber: document.querySelector("#cardNumber").value,
        expiration: document.querySelector("#expiration").value,
        code: document.querySelector("#code").value,
        items: getLocalStorage(this.key),
      };

      try {
        const response = await fetch(`${baseURL}checkout/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Order placed successfully:", result);

        // Clear the cart after successful order
        localStorage.removeItem(this.key);

        alert("Order placed successfully! Thank you for your purchase.");
      } catch (err) {
        alert("There was a problem placing your order. Please try again.");
      }
    });
  }

}