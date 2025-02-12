const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "moriyahln16@gmail.com",
        pass: "lxmp iaif shyu slxi"
    }
});

function sendEmail(to, subject, text) {
    const mailOptions = {
        from: "moriyahln16@gmail.com",
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error("❌ שגיאה בשליחת המייל:", error);
        else console.log("✅ מייל נשלח:", info.response);
    });
}

app.post("/register", (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).send("נא למלא את כל השדות!");
    }

    sendEmail(email, "אישור הרשמה לפסטיבל בלב", `שלום ${name},
    תודה שנרשמת לפסטיבל בלב!`);
    sendEmail("moriyahln16@gmail.com", "הרשמה חדשה לפסטיבל בלב", `נרשם משתמש חדש:
    שם: ${name}
    אימייל: ${email}
    טלפון: ${phone}`);
    res.send("✅ ההרשמה נשמרה בהצלחה! כעת ניתן לשלם.");
});

app.post("/payment-confirmation", (req, res) => {
    const { name, email, phone } = req.body;

    sendEmail(email, "אישור תשלום לפסטיבל בלב", `שלום ${name},
    התשלום שלך נקלט בהצלחה!`);
    sendEmail("moriyahln16@gmail.com", "תשלום חדש לפסטיבל בלב", `משתמש ביצע תשלום:
    שם: ${name}
    אימייל: ${email}
    טלפון: ${phone}`);
    res.send("✅ התשלום התקבל והמייל נשלח בהצלחה!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ השרת פועל על http://localhost:${PORT}`);
});
