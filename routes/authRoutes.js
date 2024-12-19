import express from 'express'
import {upload} from '../lib/multer_lib.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { login, register, resendOTP, verification_OTP, addAccomplishment,add_course, update_profile, alumni, post_job, post_gallery, post_event, addStudentEvent } from '../controller/postcontroller.js'
import { course, student_id, alumnilist_search, participant_id, job_id, job_id_user, admin_home, get_gallery, admin_job, event_filter, get_admin_accont, system_setting, events, getAccomplishment, getAlumni, student_event } from '../controller/getcontroller.js'
import { edit_course, user_statsUpdate, edit_job, system_setting_update, admin_accont, editAccomplishment, acceptedEvent } from '../controller/putcontroller.js'
import { delete_course, delete_participant, delete_job, deleleGallery, deleteEvent, deleteReq, deleteAccomplishment } from '../controller/deletecontroller.js'

const router = express.Router();

router.post('/register', register);

router.post('/resend_OTP', resendOTP);

router.post('/verification_OTP', verification_OTP);

router.post('/login', login);

router.get('/course/:search', course)

router.get('/student/:id', verifyToken, student_id)

router.get('/student/events/:filter/:id', verifyToken, student_event);

router.post('/student/event_add', verifyToken, upload.single("file"), addStudentEvent)

router.get('/student/accomplishment/:id', verifyToken, getAccomplishment)

router.post('/student/addAccomplishment', verifyToken, addAccomplishment)

router.put('/student/editAccomplishment', verifyToken, editAccomplishment)

router.delete('/student/deleteAccomplishment', verifyToken, deleteAccomplishment)

router.get('/student/getAlumni/:search/:id', verifyToken, getAlumni)

router.post('/admin/addCourse', verifyToken, add_course);

router.put('/admin/editCourse', verifyToken, edit_course);

router.delete('/admin/deleteCourse', verifyToken, delete_course)

router.put('/admin/user_statsUpdate', verifyToken, user_statsUpdate);

router.delete('/admin/deleteaccount', verifyToken, deleteReq);

router.get('/admin/alumnilist/:search', verifyToken, alumnilist_search)

router.post('/profile/update', verifyToken, upload.single("file"), update_profile)

router.post('/participate/alumni', verifyToken, alumni)

router.get('/participants/:id', verifyToken, participant_id)

router.delete('/participate/delete', verifyToken, delete_participant)

router.post('/jobs/post', verifyToken, post_job)

router.get('/jobs/:id', verifyToken, job_id)

router.get('/jobs/:id/user', verifyToken, job_id_user)

router.delete('/jobs/delete', verifyToken, delete_job)

router.put('/job/edit', verifyToken, edit_job)

router.get('/admin/home', verifyToken, admin_home);

router.post('/admin/gallery', verifyToken ,upload.single("file"), post_gallery);

router.get('/admin/gallery', get_gallery);

router.get('/admin/jobs', verifyToken, admin_job)

router.delete('/admin/deleteGallery', verifyToken, deleleGallery);

router.post('/admin/event', verifyToken, upload.single("file"), post_event)

router.get('/admin/event/:filter', verifyToken, event_filter)

router.delete('/admin/deleteEvent', verifyToken, deleteEvent);

router.get('/admin/account', verifyToken, get_admin_accont)

router.get('/admin/system_setting', system_setting)

router.put('/admin/system_setting', verifyToken, system_setting_update)

router.put('/admin/account', verifyToken, admin_accont)

router.get('/events', events)

router.put('/admin/acceptEvent', verifyToken, acceptedEvent)

export default router;