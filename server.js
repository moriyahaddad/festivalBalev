const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// קובץ שבו נשמור את הנתונים
const DATA_FILE = 'registrations.json';

// קריאת הנתונים הקיימים
function loadRegistrations() {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE));
    }
    return [];
}

// שמירת הנתונים בקובץ
function saveRegistrations(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post('/register', (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).send("נא למלא את כל השדות!");
    }

    let registrations = loadRegistrations();
    registrations.push({ name, email, phone, date: new Date().toISOString() });

    saveRegistrations(registrations);
    res.send("ההרשמה נשמרה בהצלחה!");
});


// הצגת כל ההרשמות
app.get('/registrations', (req, res) => {
    res.json(loadRegistrations());
});

// הפעלת השרת
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
