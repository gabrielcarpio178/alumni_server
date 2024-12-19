import {connectToDatabase} from '../lib/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { unlink } from 'node:fs';
import { JWT_KEY } from '../middleware/verifyToken.js'
import moment from 'moment'
import {main} from '../lib/sendemail.js'

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const db = await connectToDatabase();
        const [student_rows] = await db.query(`SELECT s.*, c.course AS course_name FROM students AS s INNER JOIN course AS c ON s.course = c.id WHERE s.email = '${email}'`);
        if (student_rows.length > 0) {
            var isMatch = await bcrypt.compare(password, student_rows[0].password);
            if(isMatch){
                if(student_rows[0].status===1){
                    const token = jwt.sign({ id: student_rows[0].id }, JWT_KEY, { expiresIn: '24h' });
                    return res.status(200).json({student: student_rows[0] ,token, role: "student" });
                }
                return res.status(200).json({message: 'deactived account'})
            }
        }
        const [rows_admin] = await db.query(`SELECT * FROM user WHERE email = '${email}'`);
        if (rows_admin.length > 0) {
            var isMatch = await bcrypt.compare(password, rows_admin[0].password);
            if(isMatch){
                const token = jwt.sign({ id: rows_admin[0].id }, JWT_KEY, { expiresIn: '24h' });
                return res.status(200).json({token, role: "admin" });
            }
        }

        return res.status(401).json({message : "wrong password"})
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

export const register = async (req, res)=>{
    const {lastname, firstname, middlename, gender, birthday, course, contactnumber, batch, email, student_id, password} = req.body;
    const expire_time = moment().add(30, 'minutes').format();
    const otp = generateOtp().toString();
    const hashOtp = await bcrypt.hash(otp, 10)
    if(student_id.toString().length===11){
        try {
            const db = await connectToDatabase()
            const [stundets_row] = await db.query(`SELECT * FROM students WHERE email = '${email}' OR student_id = '${student_id}' OR contact_num = '0${contactnumber}'`)
            if(stundets_row.length > 0) {
                return res.status(201).json({message : "user already existed"})
            }
    
            const [admin_row] = await db.query(`SELECT * FROM user WHERE email = '${email}'`)
            if(admin_row.length > 0) {
                return res.status(201).json({message : "user already existed"})
            }

            const message = `<h1>Your OTP is ${otp}</h1><p>This code is valid for 30 minutes. Please enter it on the website to complete your verification. If you didn’t request this, please ignore this message.</p>`
            const subjectSend = "Verify Your Account";
            main(email, message, subjectSend).catch(e=>{
                console.log(e)
            })

            return res.status(201).json({message: "user created successfully", role: 'verification', request_data: {lastname, firstname, middlename, gender, birthday, course, contactnumber: "0"+contactnumber.toString(), batch, email, student_id, password, expire_time, hashOtp}})
        } catch(err) {
            return res.status(500).json(err.message)
        }
    }
    return res.status(201).json({message: "Student id must be 11 digits"})
} 

export const resendOTP = async (req, res) => {
    const email = req.body.email;
    const otp = generateOtp().toString();
    const expire_time = moment().add(30, 'minutes').format();
    const hashOtp = await bcrypt.hash(otp, 10)

    const message = `<h1>Your OTP is ${otp}</h1><p>This code is valid for 30 minutes. Please enter it on the website to complete your verification. If you didn’t request this, please ignore this message.</p>`
    const subjectSend = "Verify Your Account";
    main(email, message, subjectSend).catch(e=>{
        console.log(e)
    })
    return res.status(201).json({request_data: {expire_time, hashOtp}})
}

export const verification_OTP = async (req, res)=>{
    const {lastname, firstname, middlename, gender, birthday, course, contactnumber, batch, email, student_id, password, hashOtp, otp} = req.body;
    var isMatch = await bcrypt.compare(otp, hashOtp);
    if(isMatch){
        try {
            const db = await connectToDatabase();
            const hashPassword = await bcrypt.hash(password, 10)
            await db.query(`INSERT INTO students(firstname, middlename, lastname, gender, birthday, course, batch, contact_num, student_id, email, password) VALUES ('${firstname}','${middlename}','${lastname}','${gender}','${birthday}','${course}', '${batch}', '${contactnumber}','${student_id}', '${email}','${hashPassword}')`);
            return res.status(200).json({message: 'success'})
        } catch (error) {
            return res.status(500).json({message: 'server error'})
        }
    }
    return res.status(200).json({message: 'invalid otp'})
}

export const addAccomplishment = async (req, res)=>{
    const {student_id, accomplishment} = req.body;
    try {
            const db = await connectToDatabase();
            await db.query(`INSERT INTO accomplishment(student_id, accomplishment) VALUES ('${student_id}','${accomplishment}')`);
            return res.status(200).json({message: 'success'})
        } catch (error) {
            return res.status(500).json({message: 'server error'})
        }
}

export const add_course = async (req, res)=>{
    const course = req.body.course;
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(`SELECT * FROM course WHERE course = '${course}'`);
        if(rows.length !== 0){
            return res.status(200).json({message: "course is use"});
        }
        await db.query(`INSERT INTO course (course) VALUES ('${course}')`);
        return res.status(200).json({message: "add success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "server error"})
    }
}

export const update_profile = async (req, res)=>{
    const {firstname, middlename, lastname, gender, birthday, contact_num, course, batch, student_id, id, email, old_password, new_password} = req.body;

    try {

        const db = await connectToDatabase();
        const [data] = await db.query(`SELECT * FROM students WHERE id = ${id}`)
        const file = req.file === undefined?data[0].profile_pic===null?data[0].profile_pic:`'${data[0].profile_pic}'`:`'${req.file.filename}'`;

        const [user_obj] = await db.query(`SELECT student_id, contact_num ,email FROM students WHERE email != '${data[0].email}' OR contact_num != '${data[0].contact_num}' OR student_id != ${data[0].student_id}`);

        let contact_nums = [];
        let student_ids = [];
        let emails = [];
        user_obj.forEach(element => {
            contact_nums.push(element.contact_num)
            student_ids.push(element.student_id)
            emails.push(element.email);
        });

        if(contact_nums.includes(contact_num)||student_ids.includes(student_id)||emails.includes(email)){
            return res.status(200).json({message: 'already use contacts'})
        }

        var isMatch = await bcrypt.compare(old_password, data[0].password);
        if(!isMatch){
            return res.status(200).json({message: 'old password not match'});
        }
        if(data[0].profile_pic !== null&&req.file !== undefined){
            unlink(`uploads/${data[0].profile_pic}`, (err) => {
                if (err) throw err;
            });
        }

        const hashPassword = await bcrypt.hash(new_password, 10);
        await db.query(`UPDATE students SET firstname='${firstname}',middlename='${middlename}',lastname='${lastname}',gender='${gender}',birthday='${birthday}',course='${course}',batch='${batch}',contact_num='${contact_num}',profile_pic=${file},student_id='${student_id}',email='${email}',password='${hashPassword}' WHERE id = '${id}'`);
        const [student] = await db.query(`SELECT s.*, c.course AS course_name FROM students AS s INNER JOIN course AS c ON s.course = c.id WHERE s.id = ${id}`);
        
        return res.status(200).json({rows : student[0]})
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
    
}

export const alumni = async (req, res)=>{
    const {student_id, event_id} = req.body
    try {
        const db = await connectToDatabase();

        const [rows] = await db.query(`SELECT p.student_id FROM participant AS p INNER JOIN students AS s ON p.student_id = s.id INNER JOIN course AS c ON s.course = c.id WHERE p.event_id = ${event_id};`);
        let student_ids = []
        rows.map(row=>{
            student_ids.push(row.student_id)
        })

        if(student_ids.includes(parseInt(student_id))){
            return res.status(200).json({message: 'you already participate'})
        }
        db.query(`INSERT INTO participant(event_id, student_id) VALUES ('${event_id}','${student_id}')`);
        return res.status(200).json({message: 'participate success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const post_job = async (req, res)=>{
    const {posted_user ,company, job_title, location_data, email ,description} = req.body
    try {
        const db = await connectToDatabase();
        await db.query(`INSERT INTO jobs(posted_user, company_name, job_title, location, email, description) VALUES (?,?,?,?,?,?)`, [posted_user ,company, job_title, location_data, email ,description]);
        return res.status(200).json({message: 'post success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const post_gallery = async (req, res)=>{
    const caption = req.body.caption;
    const file = req.file.filename;
    try {
        const db = await connectToDatabase();
        await db.query(`INSERT INTO gallery(caption, image) VALUES ('${caption}','${file}')`);
        return res.status(200).json({message: 'post success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const post_event = async (req, res)=>{
    const event = req.body.event;
    const file = req.file.filename;
    const schedule = req.body.schedule;
    const address = req.body.address;
    const description = req.body.description;
    try {
        const db = await connectToDatabase();
        await db.query(`INSERT INTO event(event, schedule, address, description, banner) VALUES ('${event}', '${schedule}', '${address}','${description}','${file}')`);
        return res.status(200).json({message: 'post success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const addStudentEvent = async (req, res)=>{
    const {id, event, schedule, description, address} = req.body;
    const file = req.file.filename;

    try {
        const db = await connectToDatabase();
        await db.query(`INSERT INTO event(posted_user, event, schedule, address, description, banner, isApprove) VALUES ('${id}', '${event}', '${schedule}', '${address}','${description}','${file}', 0)`);
        return res.status(200).json({message: 'post success'});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }

}