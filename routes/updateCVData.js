import { client } from "../config/db.js";
import { getCVData, getProfileData } from '../routes/getData.js'
import createResume from '../routes/creatingResume.js'

const sendingData = async (req, res) => {

    try {

        const user = await getProfileData(req,res)

        const dbData = await getCVData(req,res);

        console.log("dbData", dbData)

        const accurateData = Object.entries(req.body.formData).filter(([key, value]) => {
            return value !== '';
        })

        const obj = Object.fromEntries(accurateData);

        for (const [key, value] of Object.entries(obj)) {
            const result = await client.query(
                `UPDATE cv SET ${key} = $1 WHERE user_id = $2 AND documentname = $3`,
                [value, user.id, dbData.documentname]                
            );
        }

        const reconstructingTheCV = await createResume(req, res);

        return res.json({
            success : true,
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