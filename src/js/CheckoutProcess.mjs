export default class CheckoutProcess{

    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
      }

    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
          }, 0); // use reduce when dealing with [] arrays

        const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
        subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;

      }

    calculateOrderTotal() {
        // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
        this.tax = this.itemTotal * 0.06;
        this.shipping = 10.00;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

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
}