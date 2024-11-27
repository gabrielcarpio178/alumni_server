import {connectToDatabase} from '../lib/db.js'
import { unlink } from 'node:fs';
import bcrypt from 'bcrypt'
import { main } from '../lib/sendemail.js';


export const delete_course = async (req, res)=>{
    const id = req.body.id;
    try {
        const db = await connectToDatabase();
        await db.query(`DELETE FROM course WHERE id = ${id}`);
        return res.status(200).json({message: 'delete success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const deleteReq = async (req, res)=>{
    const {id, email, profile_pic} = req.body;
    try {
        const db = await connectToDatabase();
        await db.query(`DELETE FROM students WHERE id = ${id}`);

        if(profile_pic !== undefined){
            unlink(`uploads/${profile_pic}`, (err) => {
                if (err) throw err;
            });
        }

        const message = `<h1>Alumni Itech system admin</h1><p>Sorry to say that your Application Account has been delete.</p>`
        const subjectSend = "Your Account Delete";
        main(email, message, subjectSend).catch(e=>{
            console.log(e)
        })
        return res.status(200).json({message: 'delete success'});

    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const deleteAccomplishment = async (req, res)=>{
    const {id} = req.body;
    try {
        const db = await connectToDatabase();
        await db.query(`DELETE FROM accomplishment WHERE id = '${id}'`);
        return res.status(200).json({message: 'delete success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const delete_participant = async (req, res)=>{
    const {id, event_id} = req.body
    try {
        const db = await connectToDatabase();
        await db.query(`DELETE FROM participant WHERE event_id = '${event_id}' AND student_id = '${id}'`);
        return res.status(200).json({message: 'cancel success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const delete_job = async (req, res)=>{
    const id = req.body.id;
    try{
        const db = await connectToDatabase();
        await db.query(`DELETE FROM jobs WHERE id = ${id}`);
        return res.status(200).json({message: 'delete success'})
    }catch(error){
        return res.status(500).json({message: 'server error'})
    }
}

export const deleleGallery = async (req, res)=>{
    const id = req.body.id;
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(`SELECT id, caption, image, date_upload FROM gallery WHERE id = '${id}'`);
        const image = rows[0].image;
        unlink(`uploads/${image}`, (err) => {
            if (err) throw err;
            console.log(`uploads/${image} was deleted`);
        });
        await db.query(`DELETE FROM gallery WHERE id = ${id}`)
        return res.status(200).json({message: 'delete success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const deleteEvent = async (req, res)=>{
    const id = req.body.id;
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(`SELECT banner FROM event WHERE id = '${id}'`);
        const image = rows[0].banner;
        unlink(`uploads/${image}`, (err) => {
            if (err) throw err;
            console.log(`uploads/${image} was deleted`);
        });
        await db.query(`DELETE FROM event WHERE id = ${id}`)
        return res.status(200).json({message: 'delete success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}