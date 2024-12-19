import {connectToDatabase} from '../lib/db.js'

export const course = async (req, res)=>{
    const search = req.params.search;
    let search_sql = `SELECT * FROM course ORDER BY id DESC`;
    if(search !== 'all'){
        search_sql = `SELECT * FROM course WHERE course LIKE '%${search}%' ORDER BY id DESC`;
    }
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(search_sql);
        if(rows.length !== 0){
            return res.status(200).json({rows});
        }
        return res.status(200).json({message: "not found"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "server error"})
    }
}

export const student_id = async (req, res)=>{
    const id = req.params.id;
    try {
        const db = await connectToDatabase();
        const [student] = await db.query(`SELECT * FROM students WHERE id = ${id}`)
        return res.status(200).json({student});
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

export const getAccomplishment = async (req, res)=>{
    const id = req.params.id;
    try {
        const db = await connectToDatabase();
        const [accomplishments] = await db.query(`SELECT a.id ,a.accomplishment FROM accomplishment AS a WHERE student_id = '${id}'`)
        return res.status(200).json({accomplishments});
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

export const getAlumni =  async (req, res)=>{
    const {id, search} = req.params
    let sql = `SELECT s.*, a.accomplishment, c.course AS course_name FROM course AS c INNER JOIN students AS s ON c.id = s.course LEFT JOIN accomplishment AS a ON s.id = a.student_id WHERE s.status = '1' AND s.id != '${id}'`
    if(search!=='all'){
        sql+=` AND s.email LIKE '%${search}%';`
    }
    try {
        const db = await connectToDatabase();
        const [alumnu] = await db.query(sql);
        let ret_alumnu = []
        let temp_id = 0;
        alumnu.forEach(alumni => {
            if(alumni.id!==temp_id){
                ret_alumnu.push({firstname:alumni.firstname, middlename:alumni.middlename, lastname:alumni.lastname, gender:alumni.gender, batch:alumni.batch, contact_num:alumni.contact_num, profile_pic:alumni.profile_pic, student_id:alumni.student_id, course_name:alumni.course_name, email:alumni.email, accomplishments: [alumni.accomplishment]})
            }else{
                ret_alumnu[ret_alumnu.length-1].accomplishments.push(alumni.accomplishment)
            }
            temp_id = alumni.id;
        });
        return res.status(200).json({data_result: ret_alumnu});
    } catch (error) {
        console.log(error)
    }
}

export const alumnilist_search = async (req, res)=>{
    const search = req.params.search;
    let sql = "SELECT s.*, c.course as course_name, a.accomplishment FROM course AS c INNER JOIN students AS s ON s.course = c.id LEFT JOIN accomplishment AS a ON a.student_id = s.id ORDER BY s.id DESC";
    
    if(search!=='all'){
        sql = `SELECT s.*, c.course as course_name, a.accomplishment FROM course AS c INNER JOIN students AS s ON s.course = c.id LEFT JOIN accomplishment AS a ON a.student_id = s.id WHERE s.firstname LIKE '%${search}%' OR s.middlename LIKE '%${search}%' OR s.lastname LIKE '%${search}%' OR s.student_id LIKE '%${search}%' ORDER BY s.id DESC`;
    }
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(sql);

        let ret_alumnu = []
        let temp_id = 0;
        rows.forEach(row => {
            if(row.id!==temp_id){
                ret_alumnu.push({id:row.id, firstname:row.firstname, middlename:row.middlename, lastname:row.lastname, gender:row.gender, batch:row.batch, contact_num:row.contact_num, profile_pic:row.profile_pic, student_id:row.student_id, course_name:row.course_name, email:row.email, status:row.status,accomplishments: [row.accomplishment]})
            }else{
                ret_alumnu[ret_alumnu.length-1].accomplishments.push(row.accomplishment)
            }
            temp_id = row.id;
        });
        
        if(rows.length!==0){
            return res.status(200).json({ret_alumnu});
        }
        return res.status(200).json({message: 'not found'});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const participant_id = async (req, res)=>{
    const id = req.params.id;
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(`SELECT s.firstname, s.lastname, s.id, c.course, s.batch, s.profile_pic, p.event_id FROM participant AS p INNER JOIN students AS s ON p.student_id = s.id INNER JOIN course AS c ON s.course = c.id WHERE p.event_id = ${id};`);
        return res.status(200).json({rows});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const job_id = async (req, res)=>{
    const id = req.params.id;
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(`SELECT j.id, IFNULL(a.contact_num, (SELECT contact_number FROM system_data)) AS contact_num ,IFNULL(j.posted_user, 0) AS posted_user, a.profile_pic , IFNULL(a.firstname,'admin') AS firstname, IFNULL(a.middlename,'admin') AS middlename, IFNULL(a.lastname,'admin') AS lastname, j.company_name, j.job_title, j.location, j.email, j.description, j.datepost FROM jobs AS j LEFT JOIN students AS a ON j.posted_user = a.id WHERE j.posted_user != ${id} ORDER BY j.id DESC`);
        return res.status(200).json({rows});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const job_id_user = async (req, res)=>{
    const id = req.params.id;
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(`SELECT j.id, a.contact_num ,j.posted_user, a.profile_pic ,a.firstname, a.middlename, a.lastname, j.company_name, j.job_title, j.location, j.email, j.description, j.datepost FROM jobs AS j INNER JOIN students AS a ON j.posted_user = a.id WHERE j.posted_user = ${id} ORDER BY j.id DESC`);
        return res.status(200).json({rows});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const admin_home = async (req, res)=>{
    try {
        const db = await connectToDatabase();
        const [job_count] = await db.query('SELECT COUNT(*) AS total_count FROM jobs');
        const [event] = await db.query('SELECT COUNT(*) AS total_event FROM event');
        const [total_alumni] = await db.query('SELECT COUNT(*) AS total_alumni FROM students;');
        const [graphCourse] = await db.query('SELECT c.course, COUNT(a.id) AS total_alumni FROM students AS a RIGHT JOIN course AS c ON c.id = a.course GROUP BY c.course;');
        return res.status(200).json({job_count: job_count[0], event: event[0], total_alumni: total_alumni[0], graphCourse})
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const get_gallery = async (req, res)=>{
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(`SELECT id, caption, image, date_upload FROM gallery ORDER BY id DESC`);
        return res.status(200).json({rows});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const admin_job = async (req, res)=>{
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(`SELECT j.id, IFNULL(a.contact_num, (SELECT contact_number FROM system_data)) AS contact_num ,IFNULL(j.posted_user, 0) AS posted_user, a.profile_pic , IFNULL(a.firstname,'system') AS firstname, IFNULL(a.middlename,'admin') AS middlename, IFNULL(a.lastname,'admin') AS lastname, j.company_name, j.job_title, j.location, j.email, j.description, j.datepost FROM jobs AS j LEFT JOIN students AS a ON j.posted_user = a.id ORDER BY j.id DESC;`);
        return res.status(200).json({rows});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}

export const student_event = async (req, res)=>{
    const {id, filter} = req.params;
    console.log(id, filter);
    let sql = `SELECT * FROM event WHERE posted_user = '${id}' ORDER BY id DESC`; 
    if(filter!=='all'){
        sql = `SELECT * FROM event WHERE posted_user = '${id}' AND CAST(schedule AS date) LIKE '${filter}' ORDER BY schedule DESC`; 
    }
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(sql);
        return res.status(200).json({rows});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const event_filter = async (req, res)=>{
    const filter = req.params.filter;
    let sql = "SELECT * FROM event ORDER BY id DESC"; 
    if(filter!=='all'){
        sql = `SELECT * FROM event WHERE CAST(schedule AS date) LIKE '${filter}' ORDER BY schedule DESC`; 
    }
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(sql);
        return res.status(200).json({rows});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const get_admin_accont = async (req, res)=>{
    try {
        const db = await connectToDatabase();
        const [row] = await db.query('SELECT * FROM user');
        return res.status(200).json({row});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const system_setting = async (req, res)=>{
    try {
        const db = await connectToDatabase();
        const [row] = await db.query('SELECT * FROM system_data');
        return res.status(200).json({row: row[0]});
    } catch (error) {
        return res.status(500).json({message: 'server error'})
    }
}

export const events = async (req, res)=>{
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM event ORDER BY id DESC');
        return res.status(200).json({rows});
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
}