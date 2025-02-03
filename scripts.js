document.addEventListener("DOMContentLoaded", function() {
    let registerBtn = document.getElementById("register-btn");
    let modal = document.getElementById("registration-modal");
    let closeBtn = document.querySelector(".close");

    if (!registerBtn || !modal || !closeBtn) {
        console.error("🔴 שגיאה: אחד האלמנטים לא נמצא! בדקי שה-ID נכון.");
        return;
    }

    // פתיחת המודל בלחיצה על "להרשמה"
    registerBtn.addEventListener("click", function() {
        modal.style.display = "flex";
    });

    // סגירת המודל בלחיצה על "X"
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // סגירת המודל בלחיצה מחוץ לתיבה
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
document.getElementById("registration-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const age = document.getElementById("age").value;
    const email = document.getElementById("email").value;

    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, age, email })
    });

    if (response.ok) {
        alert("ההרשמה נשמרה בהצלחה!");
        document.getElementById("registration-form").reset();
    } else {
        alert("שגיאה בהרשמה. נסי שוב!");
    }
});
