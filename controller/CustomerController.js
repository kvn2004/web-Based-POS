import {CustomerDB} from "../db/CustomerDB.js";
import {Customer} from "../model/Customer.js";

// Validation functions
function validateForm() {
    let isValid = true;

    // Clear previous error states
    $(".form-control").removeClass("is-invalid");
    $(".invalid-feedback").hide();

    const id = $("#cId").val().trim();
    const name = $("#name").val().trim();
    const tel = $("#tel").val().trim();

    // Validate ID
    if (id === "") {
        $("#cId").addClass("is-invalid");
        $("#cId").next(".invalid-feedback").text("Customer ID is required").show();
        isValid = false;
    } else if (!/^C\d{3}$/.test(id)) {
        $("#cId").addClass("is-invalid");
        $("#cId").next(".invalid-feedback").text("ID must be in format C001").show();
        isValid = false;
    }

    // Validate Name
    if (name === "") {
        $("#name").addClass("is-invalid");
        $("#name").next(".invalid-feedback").text("Name is required").show();
        isValid = false;
    } else if (name.length < 3) {
        $("#name").addClass("is-invalid");
        $("#name").next(".invalid-feedback").text("Name must be at least 3 characters").show();
        isValid = false;
    }

    // Validate Telephone
    if (tel === "") {
        $("#tel").addClass("is-invalid");
        $("#tel").next(".invalid-feedback").text("Telephone is required").show();
        isValid = false;
    } else if (!/^\d{10}$/.test(tel)) {
        $("#tel").addClass("is-invalid");
        $("#tel").next(".invalid-feedback").text("Telephone must be 10 digits").show();
        isValid = false;
    }

    return isValid;
}

function clearValidation() {
    $(".form-control").removeClass("is-invalid");
    $(".invalid-feedback").hide();
}

// Modified event handlers with validation
$("#saveBtn").on("click", function () {
    if (!validateForm()) return;

    let id = $("#cId").val().trim();
    let name = $("#name").val().trim();
    let tel = $("#tel").val().trim();

    // Check for duplicate ID
    if (CustomerDB.some(c => c.getcId() === id)) {
        $("#cId").addClass("is-invalid");
        $("#cId").next(".invalid-feedback").text("Customer ID already exists").show();
        Swal.fire({
            title: "Error",
            text: "Customer ID already exists",
            icon: "error",
            width: '300px',
        });
        return;
    }

    CustomerDB.push(new Customer(id, name, tel));
    clearFields();
    clearValidation();
    loadTable();
    loadNextId();

    Swal.fire({
        title: "Success",
        text: "Customer saved successfully",
        icon: "success",
        width: '300px',
    });
});

$("#deleteBtn").on("click", function () {
    const customerId = $("#cId").val().trim();
    if (customerId === "") {
        Swal.fire({
            title: "Error",
            text: "Please select a customer to delete",
            icon: "error",
            width: '300px',
        });
        return;
    }

    const index = CustomerDB.findIndex(c => c.getcId() === customerId);
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
                CustomerDB.splice(index, 1);
                loadTable();
                clearFields();
                clearValidation();
                loadNextId();
                Swal.fire(
                    'Deleted!',
                    'Customer has been deleted.',
                    'success'
                );
            }
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Customer not found!",
            icon: "error",
            width: '300px',
        });
    }
});

$("#updateBtn").on("click", function () {
    if (!validateForm()) return;

    const customerId = $("#cId").val().trim();
    const customerName = $("#name").val().trim();
    const customerTel = $("#tel").val().trim();

    const index = CustomerDB.findIndex(c => c.getcId() === customerId);

    if (index !== -1) {
        CustomerDB[index].setcName(customerName);
        CustomerDB[index].setcTel(customerTel);

        loadTable();
        clearFields();
        clearValidation();
        loadNextId();

        Swal.fire({
            title: "Success",
            text: `Customer ${customerId} updated successfully`,
            icon: "success",
            width: '300px',
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Customer not found!",
            icon: "error",
            width: '300px',
        });
    }
});

function clearFields() {
    $("#name").val("");
    $("#tel").val("");
}

const loadTable = () => {
    $('#customer_tBody').empty();
    CustomerDB.forEach(customer => {
        let row = `<tr 
            data-id="${customer.getcId()}" 
            data-name="${customer.getcName()}" 
            data-tel="${customer.getcTel()}">
            <td>${customer.getcId()}</td>
            <td>${customer.getcName()}</td>
            <td>${customer.getcTel()}</td>
        </tr>`;
        $('#customer_tBody').append(row);
    });
}

const loadNextId = () => {
    if (CustomerDB == null || CustomerDB.length == 0) {
        $("#cId").val("C001");
    } else {
        const lastId = CustomerDB[CustomerDB.length - 1].getcId();
        const numericPart = parseInt(lastId.substring(1));
        const nextId = "C" + String(numericPart + 1).padStart(3, '0');
        $("#cId").val(nextId);
    }
}

$(document).on('click', '#customer_tBody tr', function () {
    const $row = $(this);
    $('#cId').val($row.data('id'));
    $('#name').val($row.data('name'));
    $('#tel').val($row.data('tel'));
    clearValidation();
});

// Add real-time validation (optional)
$("#name, #tel").on("input", function() {
    $(this).removeClass("is-invalid");
    $(this).next(".invalid-feedback").hide();
});

loadNextId();