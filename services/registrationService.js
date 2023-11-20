const qrCodeService = require('./QRcodeService');
const emailService = require('./emailService');
const client = require('./db');

const register = async (data) => {
    const { name, college, email, usn, contact } = data;

    try {
        // Insert data into the database
        const result = await client.query(
            "INSERT INTO registration(name, college, email, usn, contact) VALUES($1, $2, $3, $4, $5) RETURNING id",
            [name, college, email, usn, contact]
        );

        // Check if the insertion was successful
        if (result.rowCount) {
            const insertedId = result.rows[0].id;

            // Generate QR code with the inserted ID
            const qrCodeData = insertedId.toString(); // Convert to string if not already

            // Generate QR code image file
            const qrCodeImagePath = `qrcodes/qrcode_${insertedId}.png`;
            await qrCodeService.generateQRCodeToFile(qrCodeData, qrCodeImagePath);

            // Send the QR code as an email attachment
            await emailService.sendEmail(email, 'Subject: Registration Successful', `Your registration was successful! Here is your QR code:`, qrCodeImagePath);

            return "success";
        } else {
            return "something went wrong";
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return "something went wrong";
    }
};







module.exports = {
    register,
    getRegistrationStatus
}