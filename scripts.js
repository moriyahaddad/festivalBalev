document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registration-form");
    const payNowBtn = document.getElementById("pay-now");
    const paypalContainer = document.getElementById("paypal-button-container");
    const modal = document.getElementById("registration-modal");
    const closeModal = document.querySelector(".close");
    const thankYou = document.getElementById("thank-you");

    let userData = {};

    payNowBtn.addEventListener("click", function () {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!name || !email || !phone) {
            alert("נא למלא את כל השדות!");
            return;
        }

        userData = { name, email, phone };

        fetch("https://festivalbalev-production.up.railway.app/register", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(userData),
            credentials: "include" // חשוב מאוד עבור CORS
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            payNowBtn.style.display = "none";
            paypalContainer.style.display = "block";
            loadPayPalButton();
        })
        .catch(error => {
            console.error("שגיאה בשליחת ההרשמה:", error);
            alert("שגיאה בשליחת הנתונים, נסי שוב.");
        });
    });

    function loadPayPalButton() {
        paypal.Buttons({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{ amount: { value: '50.00' } }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    alert("התשלום התקבל בהצלחה!");

                    fetch("https://festivalbalev-production.up.railway.app/payment-confirmation", {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(userData),
                        credentials: "include"
                    })
                    .then(response => response.text())
                    .then(message => {
                        alert(message);
                        modal.style.display = "none";
                        thankYou.style.display = "block";
                    })
                    .catch(error => {
                        console.error("שגיאה בשליחת אישור התשלום:", error);
                        alert("שגיאה בשליחת האישור.");
                    });
                });
            }
        }).render("#paypal-button-container");
    }

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });
});
