// import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
// import { client, sender } from "./mailtrap";

// export const sendVerificationEmail = async (email: string, verificationToken: string) => {
//     const recipient = [{ email }];
//     try {
//         const res = await client.send({
//             from: sender,
//             to: recipient,
//             subject: 'Verify your email',
//             html:htmlContent.replace("{verificationToken}", verificationToken),
//             category: 'Email Verification'
//         });
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to send email verification")

//     }
// }
// export const sendWelcomeEmail = async (email: string, name: string) => {
//     const recipient = [{ email }];
//     const htmlContent = generateWelcomeEmailHtml(name);
//     try {
//         const res = await client.send({
//             from: sender,
//             to: recipient,
//             subject: 'Welcome to La Vire Pizza',
//             html:htmlContent,
//             template_variables:{
//                 company_info_name:"La Vire Pizza",
//                 name:name
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to send welcome email")
//     }
// }
// export const sendPasswordResetEmail = async (email:string, resetURL:string) => {
//     const recipient = [{ email }];
//     const htmlContent = generatePasswordResetEmailHtml(resetURL);
//     try {
//         const res = await client.send({
//             from: sender,
//             to: recipient,
//             subject: 'Reset your password',
//             html:htmlContent,
//             category:"Reset Password"
//         });
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to reset password")
//     }
// }
// export const sendResetSuccessEmail = async (email:string) => {
//     const recipient = [{ email }];
//     const htmlContent = generateResetSuccessEmailHtml();
//     try {
//         const res = await client.send({
//             from: sender,
//             to: recipient,
//             subject: 'Password Reset Successfully',
//             html:htmlContent,
//             category:"Password Reset"
//         });
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to send password reset success email");
//     }
// }
import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
import { brevoClient, sender } from "./mailtrap";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = [{ email }];
    const emailContent = htmlContent.replace("{verificationToken}", verificationToken);

    try {
        const res = await brevoClient.post("/smtp/email", {
            sender,
            to: recipient,
            subject: "Verify your email",
            htmlContent: emailContent,
            tags: ["Email Verification"] // Brevo uses "tags" instead of "category"
        });

        console.log("Verification email sent:", res.data);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send email verification");
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    const recipient = [{ email }];
    const htmlContent = generateWelcomeEmailHtml(name);

    try {
        const res = await brevoClient.post("/smtp/email", {
            sender,
            to: recipient,
            subject: "Welcome to La Vire Pizza",
            htmlContent,
            tags: ["Welcome Email"],
        });

        console.log("Welcome email sent:", res.data);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send welcome email");
    }
};

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    const recipient = [{ email }];
    const htmlContent = generatePasswordResetEmailHtml(resetURL);

    try {
        const res = await brevoClient.post("/smtp/email", {
            sender,
            to: recipient,
            subject: "Reset your password",
            htmlContent,
            tags: ["Reset Password"]
        });

        console.log("Password reset email sent:", res.data);
        console.log(resetURL);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to reset password");
    }
};

export const sendResetSuccessEmail = async (email: string) => {
    const recipient = [{ email }];
    const htmlContent = generateResetSuccessEmailHtml();

    try {
        const res = await brevoClient.post("/smtp/email", {
            sender,
            to: recipient,
            subject: "Password Reset Successfully",
            htmlContent,
            tags: ["Password Reset"]
        });

        console.log("Password reset success email sent:", res.data);
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset success email");
    }
};
