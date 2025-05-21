import { OrderDB } from "../db/OrderDB.js";
import { CustomerDB } from "../db/CustomerDB.js";
import { ItemDB } from "../db/ItemDB.js";
import { Order } from "../model/Order.js";
import { Customer } from "../model/Customer.js";

let orderItems = [];
let currentCustomer = null;
let currentItem = null;

$(document).ready(function () {
    const today = new Date().toISOString().split("T")[0];
    $("#orderDate").val(today);

    loadCustomerDropdown();
    loadItemDropdown();
    generateOrderId();

    $("#customerId").change(updateCustomerDetails);
    $("#itemId").change(updateItemDetails);
    $("#quantity").on("input", validateQuantity);
    $("#addItem").click(addItemToOrder);
    $("#cash, #discount").on("input", updatePaymentSummary);
    $("#purchase").click(completePurchase);
    $("#reload").click(() => {
        loadCustomerDropdown();
        loadItemDropdown();
    });
});

function loadCustomerDropdown() {
    const $dropdown = $("#customerId");
    $dropdown.empty().append('<option value="">Select Customer</option>');

    CustomerDB.forEach(customer => {
        $dropdown.append(`<option value="${customer._cId}">${customer._cId}</option>`);
    });
}

function updateCustomerDetails() {
    const selectedId = $("#customerId").val();
    currentCustomer = CustomerDB.find(c => c._cId === selectedId);

    if (currentCustomer) {
        $("#customerName").val(currentCustomer._cName);
    } else {
        $("#customerName").val("");
    }
}

function loadItemDropdown() {
    const $dropdown = $("#itemId");
    $dropdown.empty().append('<option value="">Select Item</option>');

    ItemDB.forEach(item => {
        $dropdown.append(`<option value="${item._iId}">${item._iId}</option>`);
    });
}

function updateItemDetails() {
    const selectedId = $("#itemId").val();
    currentItem = ItemDB.find(item => item._iId === selectedId);

    if (currentItem) {
        $("#itemName").val(currentItem._itemName);
        $("#itemPrice").val(currentItem._price);
        $("#itemQtyAvailable").val(currentItem._quantity);
    } else {
        $("#itemName").val("");
        $("#itemPrice").val("");
        $("#itemQtyAvailable").val("");
    }
}

function validateQuantity() {
    let quantity = parseInt($("#quantity").val()) || 0;
    const maxQty = currentItem ? currentItem._quantity : 0;

    if (quantity < 1) {
        quantity = 1;
    } else if (quantity > maxQty) {
        quantity = maxQty;
    }
    $("#quantity").val(quantity);
}

function addItemToOrder() {
    if (!currentItem) {
        showError("Please select an item");
        return;
    }

    const quantity = parseInt($("#quantity").val()) || 0;
    const availableQty = currentItem._quantity;

    if (quantity < 1 || quantity > availableQty) {
        showError(`Quantity must be between 1 and ${availableQty}`);
        return;
    }

    const existing = orderItems.find(item => item.id === currentItem._iId);

    if (existing) {
        if (existing.quantity + quantity > availableQty) {
            showError(`Total quantity exceeds available stock (${availableQty})`);
            return;
        }
        existing.quantity += quantity;
        existing.total = existing.quantity * currentItem._price;
    } else {
        orderItems.push({
            id: currentItem._iId,
            name: currentItem._itemName,
            price: currentItem._price,
            quantity: quantity,
            total: quantity * currentItem._price,
        });
    }

    updateOrderTable();
    updatePaymentSummary();
    $("#quantity").val(1);
}

function updateOrderTable() {
    const $table = $("#orderTable");
    $table.empty();

    orderItems.forEach(item => {
        $table.append(`
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>${item.total.toFixed(2)}</td>
            </tr>
        `);
    });
}

function updatePaymentSummary() {
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const discountPercent = parseFloat($("#discount").val()) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const total = Math.max(0, subtotal - discountAmount);
    const cash = parseFloat($("#cash").val()) || 0;
    const balance = cash - total;

    $("#subtotalAmount").text(`${subtotal.toFixed(2)} Rs/=`);
    $("#totalAmount").text(`${total.toFixed(2)} Rs/=`);
    $("#balance").val(balance.toFixed(2));
}

function completePurchase() {
    if (!currentCustomer) {
        showError("Please select a customer");
        return;
    }

    if (orderItems.length === 0) {
        showError("Please add items to the order");
        return;
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const discountPercent = parseFloat($("#discount").val()) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const total = Math.max(0, subtotal - discountAmount);
    const cash = parseFloat($("#cash").val()) || 0;
    const balance = cash - total;

    if (balance < 0) {
        showError("Insufficient cash amount");
        return;
    }

    const newOrder = new Order($("#orderId").val(), $("#orderDate").val(), total);
    OrderDB.push(newOrder);
    console.log(OrderDB);

    orderItems.forEach(orderItem => {
        const item = ItemDB.find(i => i._iId === orderItem.id);
        if (item) {
            item._quantity -= orderItem.quantity;
        }
    });

    Swal.fire({
        title: "Order Complete!",
        html: `
            <p>Order ID: ${newOrder.oid}</p>
            <p>Total: ${total.toFixed(2)} Rs/=</p>
            <p>Balance: ${balance.toFixed(2)} Rs/=</p>
        `,
        icon: "success",
    }).then(resetOrderForm);
}

function resetOrderForm() {
    orderItems = [];
    currentCustomer = null;
    currentItem = null;

    $("#orderTable").empty();
    $("#subtotalAmount, #totalAmount").text("00.00 Rs/=");
    $("#cash, #discount, #balance").val("");
    $("#quantity").val(1);
    $("#customerId, #itemId").val("");
    $("#customerName, #itemName, #itemPrice, #itemQtyAvailable").val("");

    generateOrderId();
}

function generateOrderId() {
    if (OrderDB.length === 0) {
        $("#orderId").val("OID-001");
        return;
    }

    const lastOrder = OrderDB[OrderDB.length - 1];
    const lastId = lastOrder._Oid;

    if (!lastId || typeof lastId !== "string" || !lastId.includes("-")) {
        $("#orderId").val("OID-001");
        return;
    }

    const numericPart = parseInt(lastId.split("-")[1]);
    const nextId = `OID-${String(numericPart + 1).padStart(3, "0")}`;

    $("#orderId").val(nextId);
}


function showError(message) {
    Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        width: "300px",
    });
}
