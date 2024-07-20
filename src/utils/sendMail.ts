import * as nodemailer from 'nodemailer';
import { Booking } from 'src/booking/booking.entity';

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

  await transporter.sendMail(mailOptions);
}