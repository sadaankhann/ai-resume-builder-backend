import pkg from 'pg'

const { Client } = pkg;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ai_resume_builder',
    password: '6785',
    port: 5432,
})


const connectToDB = async () =>{
    try{
        await client.connect();
    } catch(e){
        console.log(e.message);
    }
}

export{connectToDB, client}