import {ItemDB} from "../db/ItemDB.js";
import {Item} from "../model/Item.js";

// Validation functions
function validateItemForm() {
    let isValid = true;

    // Clear previous error states
    $(".form-control").removeClass("input-error");
    $(".error-message").hide().text("");

    const id = $("#iId").val().trim();
    const itemName = $("#item-name").val().trim();
    const price = $("#price").val().trim();
    const quantity = $("#quantity").val().trim();

    // Validate ID
    if (id === "") {
        $("#iId").addClass("input-error");
        $("#iId-error").text("Item ID is required").show();
        isValid = false;
    } else if (!/^I\d{3}$/.test(id)) {
        $("#iId").addClass("input-error");
        $("#iId-error").text("ID must be in format I001").show();
        isValid = false;
    }

    // Validate Item Name
    if (itemName === "") {
        $("#item-name").addClass("input-error");
        $("#item-name-error").text("Item name is required").show();
        isValid = false;
    } else if (itemName.length < 3) {
        $("#item-name").addClass("input-error");
        $("#item-name-error").text("Item name must be at least 3 characters").show();
        isValid = false;
    }

    // Validate Price
    if (price === "") {
        $("#price").addClass("input-error");
        $("#price-error").text("Price is required").show();
        isValid = false;
    } else if (isNaN(price) || parseFloat(price) <= 0) {
        $("#price").addClass("input-error");
        $("#price-error").text("Price must be a positive number").show();
        isValid = false;
    }

    // Validate Quantity
    if (quantity === "") {
        $("#quantity").addClass("input-error");
        $("#quantity-error").text("Quantity is required").show();
        isValid = false;
    } else if (!/^\d+$/.test(quantity) || parseInt(quantity) < 0) {
        $("#quantity").addClass("input-error");
        $("#quantity-error").text("Quantity must be a positive whole number").show();
        isValid = false;
    }

    return isValid;
}

function clearValidation() {
    $(".form-control").removeClass("input-error");
    $(".error-message").hide().text("");
}

// Event handlers with validation
$('#Isave').on('click', function(){
    if (!validateItemForm()) return;

    let id = $("#iId").val().trim();
    let itemName = $("#item-name").val().trim();
    let price = parseFloat($("#price").val().trim());
    let quantity = parseInt($("#quantity").val().trim());

    // Check for duplicate ID
    if (ItemDB.some(item => item.getiId() === id)) {
        $("#iId").addClass("input-error");
        $("#iId-error").text("Item ID already exists").show();
        Swal.fire({
            title: "Error",
            text: "Item ID already exists",
            icon: "error",
            width: '300px',
        });
        return;
    }

    ItemDB.push(new Item(id, itemName, price, quantity));
    clearFields();
    clearValidation();
    loadItemTable();
    loadNextId();

    Swal.fire({
        title: "Success",
        text: "Item saved successfully",
        icon: "success",
        width: '300px',
    });
});

$('#Iupdate').on('click', function(){
    if (!validateItemForm()) return;

    const itemId = $("#iId").val().trim();
    const itemName = $("#item-name").val().trim();
    const price = parseFloat($("#price").val().trim());
    const quantity = parseInt($("#quantity").val().trim());

    const index = ItemDB.findIndex(item => item.getiId() === itemId);

    if (index !== -1) {
        ItemDB[index].setitemName(itemName);
        ItemDB[index].setprice(price);
        ItemDB[index].setquantity(quantity);

        loadItemTable();
        clearFields();
        clearValidation();
        loadNextId();

        Swal.fire({
            title: "Success",
            text: `Item ${itemId} updated successfully`,
            icon: "success",
            width: '300px',
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Item not found!",
            icon: "error",
            width: '300px',
        });
    }
});

$('#Idelete').on('click', function(){
    const itemId = $("#iId").val().trim();
    if (itemId === "") {
        Swal.fire({
            title: "Error",
            text: "Please select an item to delete",
            icon: "error",
            width: '300px',
        });
        return;
    }

    const index = ItemDB.findIndex(item => item.getiId() === itemId);
    if (index !== -1) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                ItemDB.splice(index, 1);
                loadItemTable();
                clearFields();
                clearValidation();
                loadNextId();
                Swal.fire(
                    'Deleted!',
                    'Item has been deleted.',
                    'success'
                );
            }
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Item not found!",
            icon: "error",
            width: '300px',
        });
    }
});

function clearFields() {
    $("#item-name").val("");
    $("#price").val("");
    $("#quantity").val("1"); // Reset to default quantity
}

const loadItemTable = () => {
    $('#Item_tBody').empty();
    ItemDB.forEach(item => {
        let row = `<tr 
            data-id="${item.getiId()}" 
            data-name="${item.getitemName()}" 
            data-price="${item.getprice()}"
            data-quantity="${item.getquantity()}">
            <td>${item.getiId()}</td>
            <td>${item.getitemName()}</td>
            <td>${item.getprice().toFixed(2)}</td>
            <td>${item.getquantity()}</td>
        </tr>`;
        $('#Item_tBody').append(row);
    });
}

const loadNextId = () => {
    if (ItemDB == null || ItemDB.length == 0) {
        $("#iId").val("I001");
    } else {
        const lastId = ItemDB[ItemDB.length - 1].getiId();
        const numericPart = parseInt(lastId.substring(1));
        const nextId = "I" + String(numericPart + 1).padStart(3, '0');
        $("#iId").val(nextId);
    }
}

$(document).on('click', '#Item_tBody tr', function () {
    const $row = $(this);
    $('#iId').val($row.data('id'));
    $('#item-name').val($row.data('name'));
    $('#price').val($row.data('price'));
    $('#quantity').val($row.data('quantity'));
    clearValidation();
});

// Add real-time validation
$("#item-name, #price, #quantity").on("input", function() {
    $(this).removeClass("input-error");
    $(`#${this.id}-error`).hide();
});

// Initialize
loadNextId();