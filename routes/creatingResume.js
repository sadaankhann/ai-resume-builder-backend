import { client } from "../config/db.js";
import jwt from "jsonwebtoken";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { getCVData } from "./getData.js";
import creatingCV from "./creatingCV.js";

async function createResume(req, res) {

    try {

        const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        const data = await getCVData(req, res);

        if (!data) {
            return ({ success: false, error: "No CV data found for this resume name." });
        }

        const {
            documentname, name,emailaddress, profession, phonenumber, linkedinprofile, location, personalwebsite,professionlsummary, jobdescription, experience
        } = data;

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]);
        const { width, height } = page.getSize();

        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        let currentY = height - 50;
        let marginX = 50;

        page.drawText(name || 'Your Name', {
            x: marginX,
            y: currentY,
            size: 24,
            font: boldFont,
            color: rgb(0.1, 0.1, 0.1),
        });

        currentY -= 25;

        page.drawText(profession || 'Profession Title', {
            x: marginX,
            y: currentY,
            size: 14,
            font: regularFont,
            color: rgb(0.4, 0.4, 0.4),
        });

        currentY -= 30;

        const infoText = `${emailaddress || 'email@test.com'}  |  ${phonenumber || '12345'}  |  ${location || 'City, Country'}`;
        page.drawText(infoText, {
            x: marginX,
            y: currentY,
            size: 10,
            font: regularFont,
            color: rgb(0.3, 0.3, 0.3),
        });

        currentY -= 15;

        const linksText = `LinkedIn: ${linkedinprofile || 'N/A'}  |  Website: ${personalwebsite || 'N/A'}`;
        page.drawText(linksText, {
            x: marginX,
            y: currentY,
            size: 10,
            font: regularFont,
            color: rgb(0.1, 0.4, 0.8),
        });

        currentY -= 25;

        page.drawLine({
            start: { x: marginX, y: currentY },
            end: { x: width - marginX, y: currentY },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
        });

        currentY -= 35;

        //Profile Summary

        page.drawText('PROFILE SUMMARY', {
            x: marginX,
            y: currentY,
            size: 12,
            font: boldFont,
            color: rgb(0.1, 0.1, 0.1),
        });

        currentY -= 20;

        const summaryStr = professionlsummary || "Results-driven professional with a strong foundation in modern web technologies. Experienced in building scalable applications and solving complex problems with clean, efficient code.";
        page.drawText(summaryStr, {
            x: marginX,
            y: currentY,
            size: 10,
            font: regularFont,
            color: rgb(0.2, 0.2, 0.2),
            maxWidth: width - (marginX * 2),
            lineHeight: 15,
        });

        currentY -= 30;

        // Horizontal Line

         page.drawLine({
            start: { x: marginX, y: currentY },
            end: { x: width - marginX, y: currentY },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
        });

        currentY -= 30;

        // Experience

        page.drawText('Experience', {
            x: marginX,
            y: currentY,
            size: 12,
            font: boldFont,
            color: rgb(0.1, 0.1, 0.1),
        });

        currentY -= 20;

        const experiencee = experience || "Results-driven professional with a strong foundation in modern web technologies. Experienced in building scalable applications and solving complex problems with clean, efficient code.";
        page.drawText(experiencee, {
            x: marginX,
            y: currentY,
            size: 10,
            font: regularFont,
            color: rgb(0.2, 0.2, 0.2),
            maxWidth: width - (marginX * 2), // Dono sides ke margin nikal kar bachi hui jagah
            lineHeight: 14,
        });


        const pdfBytes = await pdfDoc.save();

        const safeName = (documentname || 'resume').trim();
        const folderPath = path.join(process.cwd(), 'uploads', user.email);
        const filePath = path.join(folderPath, `${safeName}.pdf`);

        fs.mkdirSync(folderPath, { recursive: true });
        fs.writeFileSync(filePath, pdfBytes);



    } catch (err) {
        throw err
    }
}

export default createResume;