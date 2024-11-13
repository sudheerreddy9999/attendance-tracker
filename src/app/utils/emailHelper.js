import nodemailer from 'nodemailer'
async function sendEmail(recipientEmail,subject,body) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'sudheerjanga99999@gmail.com',
        pass: 'holbvfiedmydkkdp'
      }
    });
 
    const mailOptions = {
      from: 'sudheerjanga99999@gmail.com',
      to: recipientEmail,
      subject: subject,
      html: body
    };
 
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const userCreationTemplate = (name,username,password)=>{
  return `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Attendance Notification Account Creation</a>
      </div>
      <p style="font-size:1.1em">Hi, ${name}</p>
      <p>You'r student account is successfully created</p>
      <p>userName : ${username}</p>
      <p>password: ${password} </p>
      <p style="font-size:0.9em;">Regards,<br />Attendance Tracker</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      </div>
    </div>
  </div>
`
}

const emailHelper = {sendEmail,userCreationTemplate}
export default emailHelper;