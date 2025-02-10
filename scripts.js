document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registration-form");
    const modal = document.getElementById("registration-modal");
    const registerBtn = document.getElementById("register-btn");
    const closeBtn = document.querySelector(".close");
    const payNowButton = document.getElementById("pay-now");
    const paymentSection = document.getElementById("payment-section");
    const paypalContainer = document.getElementById("paypal-button-container");

    // פתיחת המודל בלחיצה על "להרשמה"
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

    // שליחת הטופס
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();

            if (!name || !email || !phone) {
                alert("נא למלא את כל השדות!");
                return;
            }

            // שליחת הנתונים לשרת
            fetch("https://festivalbalev-production.up.railway.app/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone })
            })
            .then(response => response.text())
            .then(message => {
                alert(message); // הודעה על הצלחה
                paymentSection.style.display = "block"; // הצגת PayPal
            })
            .catch(error => {
                console.error("שגיאה בשליחת הנתונים:", error);
                alert("שגיאה בשליחת הנתונים, נסי שוב.");
            });
        });
    }

    // הצגת PayPal בלחיצה על "לתשלום"
    if (payNowButton) {
        payNowButton.addEventListener("click", function () {
            paymentSection.style.display = "block"; // הצגת כפתור PayPal

            paypal.Buttons({
                createOrder: function (data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: '100.00' // מחיר הכרטיס
                            }
                        }]
                    });
                },
                onApprove: function (data, actions) {
                    return actions.order.capture().then(function (details) {
                        alert('התשלום בוצע בהצלחה על ידי ' + details.payer.name.given_name);
                    });
                },
                onError: function (err) {
                    console.error('שגיאה בתשלום:', err);
                    alert('אירעה שגיאה בתשלום, נסי שוב.');
                }
            }).render('#paypal-button-container');
        });
    }
});
