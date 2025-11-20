import nodemailer from "nodemailer";

type SendEmailOTPParams = {
	email: string;
	otp: string;
};
type SendSMSOTPParams = {
	phone: string;
	otp: string;
};

// Email transporter configuration
const createEmailTransporter = async () => {
	// For development, create a test account automatically
	if (
		process.env.NODE_ENV !== "production" &&
		(!process.env.SMTP_USER || !process.env.SMTP_PASS)
	) {
		const testAccount = await nodemailer.createTestAccount();
		return nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false,
			auth: {
				user: testAccount.user,
				pass: testAccount.pass,
			},
		});
	}

	// For production, use environment variables
	return nodemailer.createTransport({
		host: process.env.SMTP_HOST || "smtp.ethereal.email",
		port: parseInt(process.env.SMTP_PORT || "587"),
		secure: process.env.SMTP_PORT === "465",
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});
};

export const sendEmailOTP = async ({ email, otp }: SendEmailOTPParams) => {
	try {
		const transporter = await createEmailTransporter();

		const mailOptions = {
			from: process.env.FROM_EMAIL || "noreply@jobportal.com",
			to: email,
			subject: "Your OTP for Job Portal Verification",
			html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; text-align: center;">Job Portal - Verification Code</h2>
                    <p style="font-size: 16px; color: #555;">Hello,</p>
                    <p style="font-size: 16px; color: #555;">Your verification code is:</p>
                    <div style="background-color: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${otp}</span>
                    </div>
                    <p style="font-size: 14px; color: #888;">This code will expire in 15 minutes. Please do not share this code with anyone.</p>
                    <p style="font-size: 14px; color: #888;">If you didn't request this code, please ignore this email.</p>
                </div>
            `,
		};

		console.log(`opt is : ${otp}`);
		const result = await transporter.sendMail(mailOptions);
		console.log(`Email OTP sent successfully to ${email}:`, result.messageId);

		// For development, log the preview URL if using Ethereal
		if (process.env.NODE_ENV !== "production") {
			console.log("Preview URL:", nodemailer.getTestMessageUrl(result));
		}
	} catch (error) {
		console.error("Error sending email OTP:", error);
		throw new Error("Failed to send email OTP");
	}
};

export const sendSMSOTP = async ({ phone, otp }: SendSMSOTPParams) => {
	try {
		// For now, just log to console
		// In production, integrate with SMS service like Twilio, AWS SNS, etc.
		console.log(`SMS OTP would be sent to ${phone}: ${otp}`);

		// TODO: Implement actual SMS sending
		// Example with Twilio:
		// const client = twilio(accountSid, authToken);
		// await client.messages.create({
		//     body: `Your Job Portal verification code is: ${otp}`,
		//     from: process.env.TWILIO_PHONE_NUMBER,
		//     to: phone
		// });

		console.log(`SMS OTP sent successfully to ${phone}`);
	} catch (error) {
		console.error("Error sending SMS OTP:", error);
		throw new Error("Failed to send SMS OTP");
	}
};
