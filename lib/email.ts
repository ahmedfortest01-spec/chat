export async function sendWelcomeEmail(email: string, name: string) {
  // Mocking email sending for production-ready scaffold
  console.log('--- EMAIL SERVICE ---');
  console.log(`To: ${email}`);
  console.log(`Subject: Welcome to NextAuth App, ${name}!`);
  console.log('Body: Thank you for joining our platform. Your account is now active.');
  console.log('---------------------');

  // In a real application, you would use Nodemailer, Resend, or SendGrid here.
  return true;
}
