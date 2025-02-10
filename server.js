const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "moriyahln16@gmail.com",
        pass: "lxmp iaif shyu slxi" // החליפי בסיסמה שלך!
    }
});

// שליחת מייל
function sendEmail(name, email, phone) {
    const mailOptions = {
        from: "moriyahln16@gmail.com",
        to: email,
        subject: "אישור תשלום לפסטיבל בלב 🎉",
        text: `שלום ${name},\n\nההרשמה שלך לפסטיבל בלב התקבלה בהצלחה!\n\nפרטי ההרשמה שלך:\nשם: ${name}\nאימייל: ${email}\nטלפון: ${phone}\n\nנשמח לראותך!`
    };

    const adminMailOptions = {
        from: "moriyahln16@gmail.com",
        to: "moriyahln16@gmail.com",
        subject: "הרשמה חדשה לפסטיבל בלב 🎉",
        text: `הרשמה חדשה התקבלה!\n\nשם: ${name}\nאימייל: ${email}\nטלפון: ${phone}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error("❌ שגיאה בשליחת המייל למשתמש:", error);
        else console.log("✅ מייל נשלח למשתמש:", info.response);
    });

    transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) console.error("❌ שגיאה בשליחת המייל לאדמין:", error);
        else console.log("✅ מייל נשלח לאדמין:", info.response);
    });
}

// טיפול בהרשמות לאחר תשלום
app.post("/register", (req, res) => {
    const { name, email, phone } = req.body;
    sendEmail(name, email, phone);
    res.send("ההרשמה והתשלום אושרו! מייל אישור נשלח.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ השרת פועל על http://localhost:${PORT}`);
});
