const nodemailer = require("nodemailer")

const sendEmail = async(options)=>{
    let transporter = nodemailer.createTransport({
      host:"smpt.gmail.com",
      port:465,
       services: process.env.SMPT_SERVICE  ,
        auth: {
          user: process.env.SMPT_MAIL, // generated ethereal user
          pass: process.env.SMPT_PASSWORD, // generated ethereal password
        },
});
 const info = await transporter.sendMail({
    from:process.env.SMPT_MAIL, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message,
  });

  await transporter.sendMail(info)

}


module.exports = sendEmail;
