import jwt from 'jsonwebtoken';
import { client } from '../config/db.js';
import { json } from 'express';

export async function getCVData(req,res) { 
    try {

        const rightName = req.body.path.replace(".pdf", "");

        const query = await client.query(`SELECT * FROM cv WHERE documentname = $1`, [rightName]);

        return query.rows[0];
        
    } catch (err) {
        console.log("getData Error:", err.message);
    }
}

export async function getProfileData(req,res){
    try{
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const query = await client.query(`SELECT * FROM users WHERE email = $1`, [decoded.email]);
        if(query.rows.length > 0){
            return query.rows[0];
        }

        return { success: false, message: 'User not found' };
        
    } catch(e){
        console.log("Something went wrong!", e);
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}

export async function getProfileDataForFrontend(req,res){
    try{
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const query = await client.query(`SELECT * FROM users WHERE email = $1`, [decoded.email]);
        if(query.rows.length > 0){
            const user = query.rows[0];
            return res.json({
                success : true,
                email: user.email,
                data : user
            })
        }

        return res.status(404).json({ success: false, message: 'User not found' });
        
    } catch(e){
        console.log("Something went wrong!", e);
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}

export async function getExperience(req){
    try{

    } catch(e){

    }
}