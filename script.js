var userName = checkCookie();

function checkCookie() {
    var name = getCookie("username");
    if (!name) {
        name = sessionStorage.getItem("username");
        if (!name) {
            while (!name || !name.trim()) {
                name = prompt("Please login by entering your username:");
                if (!name) {
                    alert("Username cannot be empty!");
                } else if (!name.trim()) {
                    alert("Username cannot consist of only whitespace!");
                }
            }
            // Store the name in cookies and session storage
            document.cookie = "username=" + name;
            sessionStorage.setItem("username", name);
            return name;
        }
    }
    return name;
}

function getCookie(name) {
    var cookieArray = document.cookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return "";
}

document.getElementById("heading").innerText = userName + "'s shopping list!";
var shoppingList = JSON.parse(localStorage.getItem(userName + "List")) || [];
var form = document.getElementById("form");
var tableBody = document.getElementById("tableBody");

function createTable() {
    tableBody.innerHTML = "";

    shoppingList.forEach((listItem, index) => {
        var row = tableBody.insertRow();

        row.insertCell().innerText = index + 1 + ".";
        row.insertCell().innerText = listItem.product;
        row.insertCell().innerText = listItem.quantity;

        row.addEventListener("click", () => {
            var confirmation = confirm("Are you sure you want to delete " + listItem.quantity + " " + listItem.product + "?");
            if (confirmation) {
                shoppingList.splice(index, 1);
                localStorage.setItem(userName + "List", JSON.stringify(shoppingList));
                tableBody.deleteRow(index);
                createTable();
            }
        });
    });
}


form.addEventListener("submit", () => {

    var productInput = document.form.product.value;
    var quantityInput = document.form.quantity.value;

    const regex = /^\d+$/;
    // var error = false;
    if (!productInput.trim() || !quantityInput.trim()) {
        alert("Fill in all the necessary fields!");
    } else if (quantityInput < 1) {
        alert("Product quantity cannot be less than 1!");
    } else if (!regex.test(quantityInput)) {
        alert("Only digits (0-9) are allowed in quantity field!");
    } else {
        var newItem = {
            product: productInput,
            quantity: quantityInput
        };

        shoppingList.push(newItem);
        localStorage.setItem(userName + "List", JSON.stringify(shoppingList));

        document.form.product.value = "";
        document.form.quantity.value = "";

        createTable();
    }
});

var logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
    document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    sessionStorage.removeItem("username");
    document.getElementsByTagName("body").id = "hide";
    location.reload();
});

createTable();