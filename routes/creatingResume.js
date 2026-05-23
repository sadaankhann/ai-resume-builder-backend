import { client } from "../config/db.js";
import jwt from "jsonwebtoken";
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import getData from "./getData.js";

async function createResume(req, res) {

    try {

        const decoded = await jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        const pdfDoc = await PDFDocument.create();

        const page = pdfDoc.addPage([600, 800]);

        page.drawText('Hello from JavaScript PDF!', {
            x: 50,
            y: 700,
            size: 20,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();

        const data = await getData();

        fs.mkdirSync(`../uploads/${data.email}`)

        fs.writeFileSync(`../uploads/${name.data}/${req.body.name}.pdf`, pdfBytes);

        res.json({
            sucess: true
        })
    } catch (err) {
        console.log(err.message);
    }

}

export default createResume