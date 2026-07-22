import { client } from "../config/db.js";
import { getCVData, getProfileData } from '../routes/getData.js'
import createResume from '../routes/creatingResume.js'
import { createValueErrorMsg } from "pdf-lib";

const sendingData = async (req, res) => {

    try {

        const user = await getProfileData(req, res)

        const documentName = req.body.path.replace(".pdf", "")



        const { name, emailaddress, phonenumber, linkedinprofile, location, profession, personalwebsite, professionlsummary } = req.body.formData;

        const { experience } = req.body.formData;

        const { education } = req.body.formData;

        const { projects } = req.body.formData;

        const { skills } = req.body.formData;

        const cv = { name, emailaddress, phonenumber, linkedinprofile, location, profession, personalwebsite, professionlsummary }

        const experience_ = { experience }

        const projects_ = { projects }

        const skills_ = { skills }

        const education_ = { education }

        const pages = [{ name: 'cv', data: cv }, { name: 'experience_', data: experience_ }, { name: 'education_', data: education_ }, { name: 'projects_', data: projects_ }, { name: 'skills_', data: skills_ }];

        for (const table of pages) {

            for (const [key_, value] of Object.entries(table.data)) {

                if (typeof value === 'object') {

                    const accurateData = Object.entries(value).filter(([key, value]) => {
                        return value !== '';
                    })

                    const obj = Object.fromEntries(accurateData);

                    for (const [key, value] of Object.entries(obj)) {

                        const result = await client.query(
                            `UPDATE ${table.name} SET ${key} = $1 WHERE user_id = $2 AND documentname = $3`,
                            [value, user.id, documentName]
                        );
                    }

                    const reconstructingTheCV = await createResume(req, res);

                    return res.json({
                        success: true,
                    })

                } else {
                    const accurateData = Object.entries(table.data).filter(([key, value]) => {
                        return value !== '';
                    })

                    const obj = Object.fromEntries(accurateData);

                    for (const [key, value] of Object.entries(obj)) {

                        const result = await client.query(
                            `UPDATE ${table.name} SET ${key} = $1 WHERE user_id = $2 AND documentname = $3`,
                            [value, user.id, documentName]
                        );
                    }

                }
            }
        }

        const reconstructingTheCV = await createResume(req, res);

        return res.json({
            success: true,
        })


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

}


export default sendingData