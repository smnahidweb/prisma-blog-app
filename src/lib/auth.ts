import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.MY_EMAIL || "default@example.com",
    pass: process.env.EMAIL_PASSWORD || "defaultpassword",
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    trustedOrigins:[process.env.APP_AUTH_URL || "http://localhost:4000"],
    user :{


      additionalFields:{
        role:{
          type : "string",
          defaultValue : "user",
          required :false,
        },
        phone :{
          type : "string",
          required : false,
        },
        status : {
          type : "string",
          defaultValue : "ACTIVE",
          required : false,
        }
      }

    },
    emailAndPassword: { 
    enabled: true, 
    autoSignIn:false,
    requireEmailVerification : true,
  },
   emailVerification: {
    autoSignInAfterVerification:true,
    sendOnSignUp: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
      const verificationUrl = `${process.env.APP_AUTH_URL || "http://localhost:4000"}/verify-email?token=${token}`;
    console.log("url:", url, "token:", token);
      const info = await transporter.sendMail({
    from: '"Prisma blog " <prisma@gmmail.com>',
    to: `${user.email}`,
    subject: "Hello ✔",  
    text: "Greeting from Prisma blog", 
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #111827;
    }
    .content {
      color: #374151;
      font-size: 15px;
      line-height: 1.6;
    }
    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }
    .verify-button {
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      display: inline-block;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #6b7280;
      text-align: center;
    }
    .link {
      word-break: break-all;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify your email</h1>
    </div>

    <div class="content">
      <p>Hello ${user.name || user.email}👋</p>
      <p>
        Thank you for signing up for <strong>Prisma Blog</strong>.
        Please confirm your email address by clicking the button below.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p class="link">${verificationUrl}</p>

      <p>
        This link will expire soon for security reasons.
      </p>
    </div>

    <div class="footer">
      <p>
        © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`, 
  });
    },
  },
  
  socialProviders: {
        google: { 
          prompt: "select_account consent",
          accessType: "offline",
          clientId: process.env.GOOGLE_CLIENT_ID as string, 
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

});
