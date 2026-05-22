import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { client } from '../config/db.js';

export const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const result = await client.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length > 0) {
            return res.json({
                success: false,
                message: 'User already exist!'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10); //actual password / salt rounds

        const creatingUser_Query = await client.query(`INSERT INTO users(name,email,password)
    VALUES($1,$2,$3)
    RETURNING *
    `, [name, email, hashedPassword])


        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET || 'fx88yrcn8y888ry8y5gn5yn5',
            { expiresIn: '1d' }
        );

        res.cookie('token', token);


        return res.json({
            success: true,
            user: creatingUser_Query.rows[0],
            token: token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Signup failed',
            error: error.message
        })
    }


}