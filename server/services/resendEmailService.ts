import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendWelcomeEmail(subscriberEmail: string): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const { data, error } = await client.emails.send({
      from: 'Garden of Weeden <onboarding@resend.dev>',
      to: subscriberEmail,
      subject: 'Welcome to Garden of Weeden! 🌿',
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #F7F1DA;">
          <div style="background-color: #245427; padding: 30px; text-align: center;">
            <h1 style="color: #F7F1DA; font-size: 32px; margin: 0; font-family: 'Georgia', serif;">
              🌿 Garden of Weeden
            </h1>
            <p style="color: #F7F1DA; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 2px;">
              VETERAN-OWNED • BUFFALO, NY
            </p>
          </div>
          
          <div style="padding: 40px 30px; background-color: #F7F1DA;">
            <h2 style="color: #245427; font-size: 24px; margin: 0 0 20px 0;">
              Welcome to the Garden!
            </h2>
            
            <p style="color: #1a1a1a; font-size: 16px; line-height: 1.6;">
              Thank you for joining our community! You're now part of something special – 
              a veteran-owned craft cannabis experience rooted in Buffalo's unique micro-terroir.
            </p>
            
            <p style="color: #1a1a1a; font-size: 16px; line-height: 1.6;">
              As a subscriber, you'll be the first to know about:
            </p>
            
            <ul style="color: #1a1a1a; font-size: 16px; line-height: 1.8; padding-left: 20px;">
              <li>New craft cannabis products and strains</li>
              <li>Exclusive events and experiences</li>
              <li>Educational content about cannabis wellness</li>
              <li>Behind-the-scenes updates from our cultivation</li>
              <li>Special offers for our community members</li>
            </ul>
            
            <div style="background-color: #245427; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="color: #F7F1DA; font-size: 16px; margin: 0; text-align: center; font-style: italic;">
                "From Service to Soil – Cultivating Excellence with Military Precision"
              </p>
            </div>
            
            <p style="color: #1a1a1a; font-size: 16px; line-height: 1.6;">
              We're excited to have you on this journey with us!
            </p>
            
            <p style="color: #245427; font-size: 16px; font-weight: bold;">
              – The Garden of Weeden Team
            </p>
          </div>
          
          <div style="background-color: #1a1a1a; padding: 25px; text-align: center;">
            <p style="color: #F7F1DA; font-size: 14px; margin: 0 0 10px 0;">
              <strong>Garden of Weeden</strong>
            </p>
            <p style="color: #888; font-size: 12px; margin: 0;">
              Buffalo, NY • Veteran-Owned Craft Cannabis
            </p>
            <p style="color: #888; font-size: 11px; margin: 15px 0 0 0;">
              You received this email because you subscribed to our newsletter.
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }

    console.log('Welcome email sent successfully to:', subscriberEmail, 'Email ID:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

export async function sendNewSubscriberNotification(subscriberEmail: string): Promise<boolean> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const { data, error } = await client.emails.send({
      from: 'Garden of Weeden <onboarding@resend.dev>',
      to: 'info@gardenofweeden.com',
      subject: '🌿 New Newsletter Subscriber - Garden of Weeden',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #245427; padding: 20px; text-align: center;">
            <h2 style="color: #F7F1DA; margin: 0;">
              New Newsletter Subscriber!
            </h2>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <p style="font-size: 16px; color: #333;"><strong>Email:</strong> ${subscriberEmail}</p>
            <p style="font-size: 16px; color: #333;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="background-color: #1a1a1a; padding: 15px; text-align: center;">
            <p style="color: #F7F1DA; font-size: 12px; margin: 0;">Garden of Weeden Admin Notification</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Failed to send admin notification:', error);
      return false;
    }

    console.log('Admin notification sent successfully. Email ID:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
}
