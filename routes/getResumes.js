import { client } from "../config/db.js";
import jwt from "jsonwebtoken";
import getData from "./getData.js";
import fs from 'fs/promises'; 
import { existsSync } from 'fs'; // existsSync import kiya safe check ke liye

async function getResumes(req, res) {
    try {
        const user = await getData(req);

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found or unauthorized" });
        }

        const targetPath = `.//uploads/${user.email}`;

        // 🔥 FIX: Agar folder abhi bana hi nahi hai, toh seedha empty array bhej do, code niche read karne nahi jayega
        if (!existsSync(targetPath)) {
            return res.json({
                success: true,
                data: []
            });
        }

        const files = await fs.readdir(targetPath);

        // Frontend ko humesha success: true bhejo, chahe files 0 hon ya zyada, taaki map function crash na ho
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