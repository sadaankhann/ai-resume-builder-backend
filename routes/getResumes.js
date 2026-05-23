import { client } from "../config/db.js";
import jwt from "jsonwebtoken";
import getData from "./getData.js";
import fs from 'fs/promises'; // promises waala fs import karo taaki await chal sake

async function getResumes(req, res) {
    try {
        // getData ko req pass karo taaki woh cookies check kar sake
        const userName = await getData(req); 
        
        if (!userName) {
            return res.status(401).json({ success: false, message: "User not found or unauthorized" });
        }

        // Ab userName direct mil chuka hai
        const files = await fs.readdir(`./${userName.email}/uploads`);
        
        return res.json({
            success: true,
            data: files
        });
    } catch (err) {
        console.log("getResumes Error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

export default getResumes;