import { client } from "../config/db.js";
import jwt from "jsonwebtoken";
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path'; 
import getData from "./getData.js";

async function createResume(req, res) {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        page.drawText('Hello from JavaScript PDF!', {
            x: 50,
            y: 700,
            size: 20,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();

        const user = await getData(req); // Humne variable ka naam 'user' rakh diya taaki confusion na ho
        if (!user) {
            return res.status(401).json({ success: false, message: "User unauthorized" });
        }

        // 🔥 FIX: user.email ka use karo taaki sahi email folder bane, [object Object] na bane
        const folderPath = `./uploads/${user.email}`; 
        const filePath = path.join(folderPath, `${req.body.name}.pdf`);

        fs.mkdirSync(folderPath, { recursive: true });
        fs.writeFileSync(filePath, pdfBytes);

        return res.json({
            success: true, 
            message: "PDF File successfully created!"
        });

    } catch (err) {
        console.log("createResume Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}

export default createResume;