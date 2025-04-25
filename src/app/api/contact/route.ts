import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail', // or "hotmail", "yahoo", or use `host` + `port` for custom SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER, // your personal email
      subject: `New message from ${name}`,
      text: `
You have a new contact form submission:

Name: ${name}
Email: ${email}
Message: ${message}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
