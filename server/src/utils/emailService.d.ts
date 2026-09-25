interface SendEmailOptions {
    email: string;
    subject: string;
    message?: string;
    html?: string;
}
declare const sendEmail: (options: SendEmailOptions) => Promise<void>;
export default sendEmail;
//# sourceMappingURL=emailService.d.ts.map