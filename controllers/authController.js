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

        const hashedPassword = await bcrypt.hash(password, 10); 

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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const query = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (query.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'No user found (Wrong Credentials)'
            });
        }

        const user = query.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Wrong password'
            });
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET || 'fx88yrcn8y888ry8y5gn5yn5',
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        });

        return res.status(200).json({
            success: true,
            message: 'Login Successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};  