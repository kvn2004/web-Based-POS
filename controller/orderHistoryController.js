// Load order history on page load
import {OrderDB} from "../db/OrderDB.js";

$(document).ready(function () {
    loadOrderHistory();
});

// Function to populate the order history table
function loadOrderHistory() {
    const $tbody = $('#orderHistoryT');
    $tbody.empty();

    OrderDB.forEach(order => {
        const price = typeof order._total === 'number' ? order._total.toFixed(2) : 'N/A';
        $tbody.append(`
            <tr>
                <td>${order._Oid || 'N/A'}</td>
                <td>${price} Rs/=</td>
                <td>${order._date || 'N/A'}</td>
            </tr>
        `);
    });
}
$('#searchBox').on('change', function () {
    searchOrders();
})


// Search functionality for Order ID, Customer ID, or Item ID
function searchOrders() {
    const searchTerm = $("#searchBox").val().toLowerCase();
    const $tbody = $("#orderHistoryT");
    $tbody.empty();

    const filteredOrders = OrderDB.filter(order =>
        order.oid.toLowerCase().includes(searchTerm) ||
        (order.customerId && order.customerId.toLowerCase().includes(searchTerm)) ||
        (order.items && order.items.some(item => item.id.toLowerCase().includes(searchTerm)))
    );

    if (filteredOrders.length === 0) {
        $tbody.append(`<tr><td colspan="3" class="text-center">No matching orders</td></tr>`);
        return;
    }

    filteredOrders.forEach(order => {
        $tbody.append(`
            <tr>
                <td>${order.oid}</td>
                <td>${order.total.toFixed(2)} Rs/=</td>
                <td>${order.date}</td>
            </tr>
        `);
    });
}
$('#reloadt').on('click', function () {
    loadOrderHistory();
    console.log(OrderDB);
})