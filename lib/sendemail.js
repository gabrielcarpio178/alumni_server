import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: "alumnitech21@gmail.com",
      pass: "heby xvxo feys hlqg",
    },
    tls: {
        rejectUnauthorized: false
    }
});


export const main = async (reviever, message, subjectSend)=>{
    
    const info = await transporter.sendMail({
        from: "Alumni ITECH System Admin <alumnitech21@gmail.com>",
        to: reviever, 
        subject: subjectSend, 
        html: message,
    })
}



