import { client } from "../config/db.js";

async function createResume(req,res) {

    try {
        const query = await client.query('INSERT INTO cv (name) VALUES ($1) RETURNING *', [req.body]);

        if (query.rows.length > 0) {
            return res.json({
                success: true
            })
        }

        res.json({
            sucess : false
        })
    } catch (err) {
        console.log(err.message);
    }

}

export default createResume