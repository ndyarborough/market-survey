const nodemailer = require('nodemailer');

const mailFunctions = {
    verifyEmail: (userEmail, link) => {
        const output = `
            <h4>${userEmail} has registered for an account with us using your email address.</h4>
            <a target='_blank' href='${link}'>Click this link to validate the email</a>
            <footer class="footer">
               <p>&copy; 2018 ENDEE SYSTEMS, Inc.</p>
            </footer>
            `;
        let transporter = nodemailer.createTransport({
            host: 'mail.twc.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'ndytest@twc.com', // generated ethereal user
                pass: 'sweetboy' // generated ethereal password
            }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Market Survey" <ndytest@twc.com>', // sender address
            to: `${userEmail}`, // list of receivers
            subject: 'Verify your MarketSurvey Account', // Subject line
            text: 'Hello world?', // plain text body
            html: output // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    },

    verifyUser: (user, link) => {
        console.log('user');
        console.log(user);
        const output = `
            <h4>${user.firstName} ${user.lastName} has requested access to your property.</h4>
            <a target='_blank' href='${link}'>Click this link to verify this user</a>            
            <footer class="footer">
                <p>&copy; 2018 ENDEE SYSTEMS, Inc.</p>
            </footer>
            `;
        let transporter = nodemailer.createTransport({
            host: 'mail.twc.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'ndytest@twc.com', // generated ethereal user
                pass: 'sweetboy' // generated ethereal password
            }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Market Survey" <ndytest@twc.com>', // sender address
            to: `ndyarborough1997@gmail.com`, // list of receivers
            subject: 'New User Request', // Subject line
            text: 'Hello world?', // plain text body
            html: output // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    }
}

module.exports = mailFunctions;