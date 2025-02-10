document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registration-form");
    const modal = document.getElementById("registration-modal");
    const registerBtn = document.getElementById("register-btn");
    const closeBtn = document.querySelector(".close");

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
                modal.style.display = "none";
            })
            .catch(error => {
                console.error("שגיאה בשליחת הנתונים:", error);
                alert("שגיאה בשליחת הנתונים, נסי שוב.");
            });
        });
    }
});
