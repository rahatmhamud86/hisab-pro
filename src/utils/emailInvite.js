import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_4rtlfoi';
const TEMPLATE_ID = 'template_uhgju0h';
const PUBLIC_KEY = '_yX1R49JrkyWDuLTM';

export const sendFamilyInviteEmail = async (inviterName, toEmail, inviteLink) => {
    try {
        const result = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                inviter_name: inviterName,
                to_email: toEmail,
                invite_link: inviteLink,
            },
            PUBLIC_KEY
        );
        return { success: true, result };
    } catch (error) {
        console.error('Email send failed:', error);
        return { success: false, error };
    }
};