import {connectToDatabase} from '../lib/db.js'
import { unlink } from 'node:fs';
import bcrypt from 'bcrypt'

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
    const id = req.body.id;
    const status = req.body.status;
    
    try {
        const db = await connectToDatabase();
        await db.query(`UPDATE students SET status='${status}' WHERE id = '${id}'`);
        return res.status(200).json({message: 'update success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
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
        await db.query(`UPDATE system_data SET system_title='${system_title}',about='${about}',contact_number='${contact_number}',email='${email}' WHERE id = '${id}'`);
        return res.status(200).json({message: 'update success'});
    }catch(error){
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