const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'moriyahln16@gmail.com',
        pass: 'lxmp iaif shyu slxi' // החליפי בסיסמה שלך!
    }
});

// פונקציה לשליחת מייל
function sendEmail(name, email, phone) {
    const mailOptions = {
        from: 'moriyahln16@gmail.com',
        to: 'moriyahln16@gmail.com',
        subject: 'הרשמה חדשה לפסטיבל בלב 🎉',
        text: `הרשמה חדשה התקבלה!\n\nשם: ${name}\nאימייל: ${email}\nטלפון: ${phone}\n\n✨ בהצלחה!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ שגיאה בשליחת המייל:', error);
        } else {
            console.log('✅ מייל נשלח:', info.response);
        }
    });
}

// שמירת נתונים לקובץ JSON
function saveRegistration(name, email, phone) {
    const filePath = 'registrations.json';
    const newEntry = { name, email, phone };

    fs.readFile(filePath, (err, data) => {
        let registrations = [];
        if (!err) {
            registrations = JSON.parse(data);
        }
        registrations.push(newEntry);

        fs.writeFile(filePath, JSON.stringify(registrations, null, 2), err => {
            if (err) console.error("❌ שגיאה בשמירת הנתונים:", err);
            else console.log("✅ הנתונים נשמרו בהצלחה!");
        });
    });
}

// טיפול בהרשמות
app.post('/register', (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).send("נא למלא את כל השדות!");
    }

    sendEmail(name, email, phone);
    saveRegistration(name, email, phone);

    res.send("ההרשמה נשמרה ונשלחה למייל בהצלחה!");
});

// הפעלת השרת
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`✅ השרת פועל על http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
    res.send("🎉 השרת עובד בהצלחה!");
});

