const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// יצירת תיקייה לקבלות אם אינה קיימת
const receiptsDir = path.join(__dirname, "receipts");
if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir);
}

// הגדרת שרת מיילים
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "moriyahln16@gmail.com",
        pass: "lxmp iaif shyu slxi"
    }
});

// פונקציה לשליחת מיילים
function sendEmail(to, subject, text, attachment = null) {
    const mailOptions = {
        from: "moriyahln16@gmail.com",
        to,
        subject,
        text,
        attachments: attachment ? [{ filename: "receipt.pdf", path: attachment }] : []
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error("❌ שגיאה בשליחת המייל:", error);
        else console.log("✅ מייל נשלח:", info.response);
    });
}

// יצירת קבלה בפורמט PDF
function generateReceipt(name, email, phone) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(receiptsDir, `${name.replace(/\s+/g, '_')}_receipt.pdf`);
        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(20).text("קבלה - פסטיבל בלב", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`שם: ${name}`);
        doc.text(`אימייל: ${email}`);
        doc.text(`טלפון: ${phone}`);
        doc.text(`סכום: 50.00 ש"ח`);
        doc.text(`תאריך: ${new Date().toLocaleDateString("he-IL")}`);
        doc.end();

        doc.on("finish", () => resolve(filePath));
        doc.on("error", reject);
    });
}

// טיפול בהרשמות
app.post("/register", (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).send("נא למלא את כל השדות!");
    }

    sendEmail(email, "אישור הרשמה לפסטיבל בלב", `שלום ${name}, תודה שנרשמת!`);
    sendEmail("moriyahln16@gmail.com", "הרשמה חדשה לפסטיבל בלב", `נרשם משתמש חדש:\nשם: ${name}\nאימייל: ${email}\nטלפון: ${phone}`);

    res.send("✅ ההרשמה נשמרה בהצלחה! כעת ניתן לשלם.");
});

// אישור תשלום ושליחת קבלה
app.post("/payment-confirmation", async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const receiptPath = await generateReceipt(name, email, phone);
        sendEmail(email, "אישור תשלום לפסטיבל בלב", `שלום ${name}, התשלום שלך התקבל!`, receiptPath);
        sendEmail("moriyahln16@gmail.com", "תשלום חדש לפסטיבל בלב", `משתמש ביצע תשלום:\nשם: ${name}\nאימייל: ${email}\nטלפון: ${phone}`);

        res.send({ message: "✅ התשלום התקבל והמייל עם הקבלה נשלח בהצלחה!", success: true });
    } catch (error) {
        console.error("❌ שגיאה בשליחת הקבלה:", error);
        res.status(500).send({ message: "❌ שגיאה בשליחת הקבלה.", success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ השרת פועל על http://localhost:${PORT}`);
});
