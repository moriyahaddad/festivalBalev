document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registration-form");
    const modal = document.getElementById("registration-modal");
    const registerBtn = document.getElementById("register-btn");
    const closeBtn = document.querySelector(".close");
    const payNowBtn = document.getElementById("pay-now");
    const paypalContainer = document.getElementById("paypal-button-container");

    if (registerBtn) {
        registerBtn.addEventListener("click", function () {
            modal.style.display = "flex";
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    if (registerForm) {
        payNowBtn.addEventListener("click", function () {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();

            if (!name || !email || !phone) {
                alert("נא למלא את כל השדות!");
                return;
            }

            fetch("https://festivalbalev-production.up.railway.app/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone })
            })
            .then(response => response.text())
            .then(message => {
                alert(message);
                payNowBtn.style.display = "none";
                paypalContainer.style.display = "block";
                
                paypal.Buttons({
                    createOrder: function(data, actions) {
                        return actions.order.create({
                            purchase_units: [{
                                amount: { value: "50.00" } // עדכני למחיר הנכון
                            }]
                        });
                    },
                    onApprove: function(data, actions) {
                        return actions.order.capture().then(function(details) {
                            alert("תשלום בוצע בהצלחה! תודה " + details.payer.name.given_name);
                            fetch("https://festivalbalev-production.up.railway.app/payment-success", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ name, email, phone, paymentId: details.id })
                            });
                        });
                    }
                }).render("#paypal-button-container");
            })
            .catch(error => {
                console.error("שגיאה בשליחת הנתונים:", error);
                alert("שגיאה בשליחת הנתונים, נסי שוב.");
            });
        });
    }
});
