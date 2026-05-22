import jwt from 'jsonwebtoken';
import { client } from '../config/db.js';

async function getData (req,res)  {
    try{
    const decoded = await jwt.verify(req.cookies.token, process.env.JWT_SECRET || 'fx88yrcn8y888ry8y5gn5yn5');
    const userEmail = decoded.email;
    const query = await client.query(`SELECT name FROM users WHERE email = $1`, [userEmail]);
    if (query.rows.length > 0) {
        return res.json({
            success: true,
            data: query.rows[0].name
        });
    }
    return res.json({
        success : false,
        data : 'User not found!'
    })} catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch user data',
            error: err.message
        });
    }
}

export default getData;