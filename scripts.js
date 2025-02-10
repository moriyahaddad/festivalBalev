document.addEventListener("DOMContentLoaded", function () {
    const payNowBtn = document.getElementById("pay-now");
    const modal = document.getElementById("registration-modal");

    // לחיצה על "לתשלום" מפעילה את PayPal
    if (payNowBtn) {
        payNowBtn.addEventListener("click", function () {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();

            if (!name || !email || !phone) {
                alert("נא למלא את כל השדות!");
                return;
            }

            // שליחת הנתונים לשרת לפני התשלום
            fetch("https://festivalbalev-production.up.railway.app/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone })
            })
            .then(response => response.text())
            .then(message => {
                console.log("✅ הרשמה נשמרה:", message);

                // הפעלת PayPal
                paypal.Buttons({
                    createOrder: function (data, actions) {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '100.00', // סכום לדוגמה
                                    currency_code: 'ILS'
                                }
                            }]
                        });
                    },
                    onApprove: function (data, actions) {
                        return actions.order.capture().then(function (details) {
                            alert("התשלום הצליח! תודה, " + details.payer.name.given_name);
                            modal.style.display = "none"; // סגירת המודאל
                        });
                    }
                }).render('body'); // PayPal יוצג מיד
            })
            .catch(error => {
                console.error("❌ שגיאה בשליחת הנתונים:", error);
                alert("שגיאה בשליחת הנתונים, נסי שוב.");
            });
        });
    }
});
