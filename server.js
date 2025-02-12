const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const app = express();
app.use(bodyParser.json());

// לאפשר גישה מכל מקור לצורך בדיקה
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "moriyahln16@gmail.com",
        pass: "lxmp iaif shyu slxi"
    }
});

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

function generateReceipt(name, email, phone) {
    return new Promise((resolve, reject) => {
        const filePath = `receipts/${name.replace(/\s+/g, '_')}_receipt.pdf`;
        const doc = new PDFDocument();

        fs.mkdirSync("receipts", { recursive: true });

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

// שליחת מייל אישור הרשמה רק למייל של מוריה
app.post("/register", (req, res) => {
    const { name, email, phone } = req.body;
    sendEmail("moriyahln16@gmail.com", "הרשמה חדשה לפסטיבל בלב", `משתמש נרשם:
שם: ${name}
אימייל: ${email}
טלפון: ${phone}`);
    res.send("✅ ההרשמה נקלטה בהצלחה!");
});

// אישור תשלום ושליחת חשבונית למי ששילם ולמוריה
app.post("/payment-confirmation", async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const receiptPath = await generateReceipt(name, email, phone);
        sendEmail(email, "אישור תשלום לפסטיבל בלב", `שלום ${name}, התשלום שלך התקבל!`, receiptPath);
        sendEmail("moriyahln16@gmail.com", "תשלום חדש לפסטיבל בלב", `תשלום התקבל:
שם: ${name}
אימייל: ${email}
טלפון: ${phone}`, receiptPath);
        
        // הוספת הודעה JSON עם אישור להצגת תמונת התודה וסגירת החלון
        res.json({
            message: "✅ התשלום התקבל והמייל עם הקבלה נשלח בהצלחה!",
            showThankYou: true
        });
    } catch (error) {
        console.error("❌ שגיאה בשליחת הקבלה:", error);
        res.status(500).send("שגיאה בשליחת הקבלה.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ השרת פועל על http://localhost:${PORT}`);
});
