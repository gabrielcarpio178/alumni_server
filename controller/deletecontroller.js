import {connectToDatabase} from '../lib/db.js'
import { unlink } from 'node:fs';
import bcrypt from 'bcrypt'

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