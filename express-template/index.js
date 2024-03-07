const express = require('express')
const axios = require('axios')
const cors = require('cors')

const API = 'https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers';

// Form validation
const isValidName = (name) => /^[a-zA-Z]+$/.test(name);
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);

const app = express();
app.use(express.json());
app.use(cors())

app.get('/api/supervisors', async (req, res) => {
    try {
        const response = await axios.get(API);
        const supervisors = response.data.filter((data) => !(Number(data.jurisdiction) >= 0 && Number(data.jurisdiction) <= 9))

        const filteredSupervisors = supervisors
            .sort((a, b) => {
                if (a.jurisdiction !== b.jurisdiction) {
                    return a.jurisdiction.localeCompare(b.jurisdiction);
                } else if (a.lastName !== b.lastName) {
                    return a.lastName.localeCompare(b.lastName);
                } else {
                    return a.firstName.localeCompare(b.firstName);
                }
            })
            .map((data) => `${data.jurisdiction} - ${data.lastName}, ${data.firstName}`)

        res.json({
            success: true,
            data: filteredSupervisors
        });
    } catch (error) {
        console.error("Error fetching supervisors:", error);
        res.status(500).json({
            success: false,
            message: "List fetch failed."
        });
    }
});

app.post('/api/submit', (req, res) => {
    const { firstName, lastName, email, phoneNumber, supervisor } = req.body;

    if (!firstName || !lastName || !supervisor) {
        return res.status(400).json({
            success: false,
            message: "First name, last name, and supervisor are required fields."
        });
    }

    if (!isValidName(firstName) || !isValidName(lastName)) {
        return res.status(400).json({
            success: false,
            message: "First name and last name must only contain letters."
        });
    }

    if (email && !isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "The email format is invalid."
        });
    }

    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({
            success: false,
            message: "Invalid phone number format. Please provide 10 digits."
        });
    }

    const newNotification = {
        firstName,
        lastName,
        email: email ?? "",
        phoneNumber: phoneNumber ?? "",
        supervisor
    };

    console.log("New Notification Request:");
    console.log(newNotification);

    res.json({
        success: true,
        message: "Notification request submitted successfully.",
        data: newNotification
    });
});

app.listen(8080, () => console.log(`Listening on 8080. Ctrl+C to stop this server.`));
