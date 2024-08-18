import {
    sender,
    mailtrapClient
} from './mailtrap.config.js'
import {
    VERIFICATION_EMAIL_TEMPLATE
} from './emailTemplate.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: 'Email Verification'
        })
        console.log('Verification email sent successfully:', response)
    } catch (error) {
        console.error(`Error sending verification email : ${error.message}`)
        throw new Error(`Failed to send verification email: ${error.message}`)
    }
}

export const sendWelcomeEmail = async (name, email) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: 'af63b788-781c-4595-9bd6-b99211520f86',
            template_variables: {
                company_info_name: "Auth System",
                name: name
            }
        })
        console.log("Welcome Email sent successfully:", response)
    } catch (error) {
        console.error(`Error sending welcome email : ${error.message}`)
        throw new Error(`Failed to send welcome email: ${error.message}`)
    }
}