import { client } from "../config/db.js";
import {getProfileData} from "./getData.js";
import fs from 'fs/promises'; 
import { existsSync } from 'fs';

async function getResumes(req, res) {
    try {

        const user = await getProfileData(req,res);

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found or unauthorized" });
        }

        const targetPath = `.//uploads/${user.email}`;

        if (!existsSync(targetPath)) {
            return res.json({
                success: false,
                data: []
            });
        }

        const files = await fs.readdir(targetPath);

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