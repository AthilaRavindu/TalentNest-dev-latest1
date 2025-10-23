import nodemailer from 'nodemailer';
// import Mailgen from 'mailgen';

// This service sends an OTP email to the user for verification purposes after fill signup form.
export const sendOtpMailService = async (email, otp ) => {

    const myEmail = process.env.SMTP_USER;
    const myPassword = process.env.SMTP_PASS;

    if(!otp || !email) {
        throw new Error("Email and OTP are required to send the email.");
    }

    const config = {
        service : "gmail",
        auth : {
            user: myEmail,
            pass: myPassword
        },
        connectionTimeout: 10000 // Fail if can't connect in 10 seconds
    }

    // Create an account with real credentials.
    const transporter = nodemailer.createTransport(config);

    // confirm transporter works
    await transporter.verify();

 // Custom HTML Email Template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(38, 166, 154, 0.15);">
                        
                        <!-- Header with gradient -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #26A69A 0%, #1E8E7E 100%); padding: 40px 40px 30px 40px; text-align: center;">
                                <img src="https://firebasestorage.googleapis.com/v0/b/viduna-image.appspot.com/o/TalentNest%2FTalentNest_uo_down_merged.png?alt=media&token=190daa15-5839-42ad-a5a2-e8f9f774ca4d" alt="Talent Nest" style="max-width: 300px; height: auto; margin-bottom: 20px; filter: brightness(0) invert(1);">
                                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600; letter-spacing: -0.5px;">
                                    Password Reset
                                </h1>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 50px 40px;">
                                <p style="color: #555555; font-size: 16px; line-height: 26px; margin: 0 0 30px 0; text-align: center;">
                                    We received a request to reset your password.<br>
                                    Use the verification code below to proceed:
                                </p>

                                <!-- OTP Box -->
                                <div style="background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); border-radius: 12px; padding: 40px; margin: 0 0 30px 0; text-align: center; border: 3px solid #26A69A;">
                                    <p style="color: #26A69A; font-size: 13px; margin: 0 0 15px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                                        Verification Code
                                    </p>
                                    <div style="font-size: 52px; font-weight: 800; color: #26A69A; letter-spacing: 12px; font-family: 'Courier New', Consolas, monospace; text-shadow: 2px 2px 4px rgba(38, 166, 154, 0.1);">
                                        ${otp}
                                    </div>
                                    <div style="width: 60px; height: 4px; background-color: #26A69A; margin: 20px auto 0; border-radius: 2px;"></div>
                                </div>

                                <!-- Info Box -->
                                <div style="background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 16px 20px; margin: 0 0 30px 0; border-radius: 4px;">
                                    <p style="color: #f57f17; font-size: 14px; margin: 0; line-height: 22px;">
                                        <strong>⏱️ Important:</strong> This code expires in <strong>5 minutes</strong>
                                    </p>
                                </div>

                                <p style="color: #999999; font-size: 14px; line-height: 22px; margin: 0; text-align: center;">
                                    If you didn't request a password reset, please ignore this email.<br>
                                    Your account security remains intact.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f5f5f5; padding: 30px 40px; text-align: center;">
                                <p style="color: #999999; font-size: 13px; margin: 0 0 8px 0;">
                                    © ${new Date().getFullYear()} Tekly Solutions. All rights reserved.
                                </p>
                                <p style="margin: 0;">
                                    <a href="https://teklysolutions.com" style="color: #26A69A; text-decoration: none; font-size: 13px; font-weight: 600;">
                                        Visit our website →
                                    </a>
                                </p>
                            </td>
                        </tr>

                    </table>
                    
                    <!-- Bottom spacing -->
                    <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 20px 0 0 0; text-align: center;">
                        Need help? Contact our support team
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    // const mailGenerator = new Mailgen({
    //     theme: "default",
    //     product: {
    //         name: "TalentNest",
    //         link: "https://teklysolutions.com",
    //         logo: "https://teklysolutions.com/assets/images/logo/logo-dark.svg"
    //     }
    // })

    // Create the email content
    // const emailContent = {  
    //     body: {
    //         intro: 'You are receiving this email because we received a request to verify your email address.',
    //         action: {
    //         instructions: 'Use the following OTP to complete your verification:',
    //         button: {
    //             color: '#009688', // teal button color
    //             text: `OTP: ${otp}`, // will appear big and bold
    //             //link: 'https://yourdomain.com/verify' // or just '#'
    //         }
    //         },

    //         outro: 'This OTP is valid for 10 minutes. If you did not request this, please ignore this email.'
    //     }
    // }
    // const emailContent = {  
    //     body: {
    //         intro: 'We received a request to reset your password.',
    //         action: {
    //             instructions: 'Use this OTP to reset your password:',
    //             button: {
    //                 color: '#009688',
    //                 text: otp,
    //             }
    //         },
    //         outro: 'This OTP expires in 10 minutes. If you didn\'t request this, ignore this email.'
    //     }
    // }

    // Generate the HTML content
    // const mailHtmlBody = mailGenerator.generate(emailContent);

    // Define the email message
    const message = {
        from: myEmail,
        to: email,
        subject: "Reset Your Password - OTP Code",
        html: htmlContent,
    }

    // Send the email
    const info = await transporter.sendMail(message);

    return info.messageId ? info.messageId : null;
}