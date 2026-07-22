import jwt from 'jsonwebtoken';
import { client } from '../config/db.js';
import { getProfileData } from './getData.js';
export default async function creatingCV(req, res) {
    try {

        const user = await getProfileData(req,res);

        const documentName = req.body.name;

        if (!documentName) {
            return res.status(400).json({
                success: false,
                message: 'Resume name is required.'
            });
        }

        const existingCV = await client.query(`SELECT * FROM cv WHERE documentname = $1 and user_id = $2`, [documentName, user.id]);

        if (existingCV.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'CV Already Exist!'
            });
        }

        const userId = await jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        const gettingUserId = await client.query(`SELECT id FROM users WHERE email = $1`, [userId.email]);

        if (!gettingUserId.rows[0]) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        await client.query(
            "INSERT INTO cv (documentname, user_id, emailaddress) VALUES($1, $2, $3)",
            [documentName, gettingUserId.rows[0].id, userId.email]
        );

        return res.json({ success: true, message: 'CV entry created' });

    } catch (e) {
        console.log("Something went wrong!", e);
        return res.status(500).json({ success: false, error: e.message });
    }
}