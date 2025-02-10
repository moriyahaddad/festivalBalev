document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registration-form");
    const modal = document.getElementById("registration-modal");
    const registerBtn = document.getElementById("register-btn");
    const closeBtn = document.querySelector(".close");
    const payNowBtn = document.getElementById("pay-now");
    const paypalContainer = document.getElementById("paypal-button-container");

    // פתיחת המודל
    if (registerBtn) {
        registerBtn.addEventListener("click", function () {
            modal.style.display = "flex";
        });
    }

    // סגירה בלחיצה על ה-X
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    // סגירה בלחיצה מחוץ לחלון
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // טיפול בלחיצה על "לתשלום"
    if (payNowBtn) {
        payNowBtn.addEventListener("click", function () {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();

            if (!name || !email || !phone) {
                alert("נא למלא את כל השדות!");
                return;
            }

            // הצגת כפתור PayPal
            paypalContainer.style.display = "block";

            // טעינת PayPal
            paypal.Buttons({
                createOrder: function (data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: "100.00" // סכום לתשלום
                            }
                        }]
                    });
                },
                onApprove: function (data, actions) {
                    return actions.order.capture().then(function (details) {
                        alert("התשלום בוצע בהצלחה על ידי " + details.payer.name.given_name);

                        // שליחת מידע לשרת לאחר התשלום
                        fetch("https://festivalbalev-production.up.railway.app/register", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name, email, phone })
                        })
                        .then(response => response.text())
                        .then(message => {
                            alert("ההרשמה והתשלום נשמרו ונשלחו למייל בהצלחה!");
                            modal.style.display = "none";
                        })
                        .catch(error => {
                            console.error("שגיאה בשליחת הנתונים:", error);
                            alert("שגיאה בשליחת הנתונים, נסי שוב.");
                        });
                    });
                }
            }).render("#paypal-button-container");
        });
    }
});
