import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";

loadHeaderFooter();


document.addEventListener("DOMContentLoaded", successConfirmation);


function successConfirmation() {
    const params = new URLSearchParams(window.location.search);
    const successFlag = params.get("success");

    if (successFlag === "true") {
        const orderData = getLocalStorage("checkout-form");

        if (orderData) {
            // Inject into success.html placeholders
            document.querySelector("#orderDate").innerText = orderData.orderDate;
            document.querySelector("#customerName").innerText = `${orderData.fname} ${orderData.lname}`;
            document.querySelector("#shippingAddress").innerText =
                `${orderData.street}, ${orderData.city}, ${orderData.state} ${orderData.zip}`;

            // Items list
            const itemsContainer = document.querySelector("#orderItems");
            itemsContainer.innerHTML = ""; // clear first
            orderData.items.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.Name} - $${item.FinalPrice} x ${item.quantity || 1}`;
                itemsContainer.appendChild(li);
            });

            // Totals
            const total = orderData.items.reduce((sum, item) => {
                const qty = Number(item.quantity) || 1;
                return sum + (item.FinalPrice * qty);
            }, 0);
            document.querySelector("#orderTotal").innerText = `$${total.toFixed(2)}`;

            // clear checkout-form after rendering
            localStorage.removeItem("checkout-form");
        } else {
            document.querySelector("#confirmationMessage").innerText =
                "No order data found. Please return to checkout.";
        }
    } else {
        document.querySelector("#confirmationMessage").innerText =
            "Order not confirmed. Please try again.";
    }

}



