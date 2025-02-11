function loadPayPalButton() {
    paypal.Buttons({
        fundingSource: paypal.FUNDING.CARD, // מבטיח שהתשלום בכרטיס אשראי ייפתח נכון
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: '50.00' }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert("התשלום התקבל בהצלחה!");

                fetch("https://festivalbalev-production.up.railway.app/payment-confirmation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                })
                .then(response => response.text())
                .then(message => {
                    alert(message);
                })
                .catch(error => {
                    console.error("שגיאה בשליחת אישור התשלום:", error);
                    alert("שגיאה בשליחת האישור.");
                });
            });
        },
        onError: function (err) {
            console.error("שגיאה בתשלום:", err);
            alert("שגיאה בתשלום, נסי שוב.");
        },
        style: {
            layout: 'horizontal' // מבטיח שהתשלום בכרטיס אשראי יוצג בצורה טובה יותר
        }
    }).render("#paypal-button-container");
}
