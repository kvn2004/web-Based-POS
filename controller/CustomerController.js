import {CustomerDB} from "../db/CustomerDB.js";
import {Customer} from "../model/Customer.js";


$("#saveBtn").on("click", function () {
    let id = $("#cId").val();
    let name = $("#name").val();
    let tel = $("#tel").val();

    if (id === "" || name === "" || tel === "") {
        Swal.fire({
            title: "Warning",
            text: "Please fill out all the fields",
            icon: "warning",
            width: '250px',
        });
        return;
    } else {
        CustomerDB.push(new Customer(id, name, tel));
        console.log(CustomerDB);
        clearFields();
        loadTable();
        loadNextId();

    }
});

function clearFields() {
    // $("#cId").val("");
    $("#name").val("");
    $("#tel").val("");
}

const loadTable = () => {
    $('#customer_tBody').empty();
    CustomerDB.forEach(customer => {
        let row = `<tr>
        <td>${customer.getcId()}</td>
        <td>${customer.getcName()}</td>
        <td>${customer.getcTel()}</td>
        </tr>`;
        $('#customer_tBody').append(row);
    })
}
const loadNextId =()=>{
    if (CustomerDB == null || CustomerDB.length == 0){
        $("#cId").val("C001");
    }else {
        const lastId = CustomerDB[CustomerDB.length - 1].getcId();
        const numericPart = parseInt(lastId.substring(1));
        const nextId = "C" + String(numericPart + 1).padStart(3, '0');
        $("#cId").val(nextId);
    }
}


