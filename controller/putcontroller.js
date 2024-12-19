import {connectToDatabase} from '../lib/db.js'
import bcrypt from 'bcrypt';
import { main } from '../lib/sendemail.js';

export const edit_course = async (req, res)=>{
    const id = req.body.id;
    const course = req.body.course;
    try{
        const db = await connectToDatabase();
        const [rows] = await db.query(`SELECT * FROM course WHERE course = '${course}'`);
        if(rows.length !== 0){
            return res.status(200).json({message: "course is use"});
        }
        await db.query(`UPDATE course SET course='${course}' WHERE id = ${id}`);
        return res.status(200).json({message: 'update success'});
    }catch(error){
        console.log(error);
        return res.status(500).json({message: 'server error'})
    }
}

export const user_statsUpdate = async (req, res)=>{
    const {id, status, email} = req.body;
    try {
        const db = await connectToDatabase();
        await db.query(`UPDATE students SET status='${status}' WHERE id = '${id}'`);

        const message = `<h1>Alumni Itech system admin</h1><p>We are pleased to inform you that your account application has been ${status==1?"Activate":"Deactivate"}. Thank you</p>`
        const subjectSend = status==1?"Your Account Activate":"Your Account Deactivate";
        main(email, message, subjectSend).catch(e=>{
            console.log(e)
        })

        return res.status(200).json({message: 'update success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const editAccomplishment = async (req, res)=>{
    const {id, accomplishment} = req.body;
    try {
        const db = await connectToDatabase();
        await db.query(`UPDATE accomplishment SET accomplishment='${accomplishment}' WHERE id = ${id}`);
        return res.status(200).json({message: 'update success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}


export const edit_job =  async (req, res)=>{
    const {id, company_name, job_title, location, email, description} = req.body;
    try {
        const db = await connectToDatabase();
        await db.query(`UPDATE jobs SET company_name='${company_name}',job_title='${job_title}',location='${location}',email='${email}',description='${description}' WHERE id = '${id}'`);
        return res.status(200).json({message: 'update success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const system_setting_update = async (req, res)=>{
    req.body.contact_number = req.body.contact_number.toString();
    const {id, system_title, about, email, contact_number} = req.body;
    try{
        const db = await connectToDatabase();
        await db.query(`UPDATE system_data SET system_title=?,about=?,contact_number=?,email=? WHERE id = ?`,[system_title, about, contact_number, email, id]);
        return res.status(200).json({message: 'update success'});
    }catch(error){
        console.log(error)
        return res.status(500).json({message: 'server error'})
    }
}

export const admin_accont = async (req, res)=>{
    const id = req.body.id;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const db = await connectToDatabase();
        const hashPassword = await bcrypt.hash(password, 10)
        await db.query(`UPDATE user SET email='${email}',password='${hashPassword}' WHERE id = '${id}'`);
        return res.status(200).json({message: 'update success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const acceptedEvent = async (req, res)=>{
    const id = req.body.id;
    try {
        const db = await connectToDatabase();
        await db.query("UPDATE `event` SET `isApprove`= 1 WHERE `id`= ?",[id]);
        return res.status(200).json({message: 'update success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}