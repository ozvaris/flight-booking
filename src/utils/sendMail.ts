import * as nodemailer from 'nodemailer';
import { Booking } from 'src/booking/booking.entity';
import logger from './elkStack';

export async function sendBookingConfirmation(email: string, booking: Booking) {
  const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false,
    auth: {
      user: 'your_email@example.com',
      pass: 'your_email_password',
    },
  });

  const mailOptions = {
    from: 'your_email@example.com',
    to: email,
    subject:

 'Booking Confirmation',
    text: `Your booking is confirmed. Booking details: ${JSON.stringify(booking)}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${email} with booking details: ${JSON.stringify(booking)}`, { event_type: 'email_sent', tag: 'bookingEmail', user_email: booking.user.email });
  } catch (error) {
    logger.error(`Failed to send email to ${email}: ${error.message}`, { event_type: 'email_sent', tag: 'bookingEmail', user_email: booking.user.email });
  }
}