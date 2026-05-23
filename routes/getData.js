import jwt from 'jsonwebtoken';
import { client } from '../config/db.js';

// req ko pass karo taaki cookies mil sakein, res ki zaroorat nahi hai
async function getData(req) { 
    try {
        const decoded = await jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const userEmail = decoded.email;
        const query = await client.query(`SELECT * FROM users WHERE email = $1`, [userEmail]);
        
        if (query.rows.length > 0) {
            return query.rows[0]; // Direct string return karo
        }
        return null;
    } catch (err) {
        console.log("getData Error:", err.message);
        return null;
    }
}

export default getData;