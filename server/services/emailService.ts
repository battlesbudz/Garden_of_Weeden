
import { MailService } from '@sendgrid/mail';
import type { MeetingRequest, InvestorMessage, InvestorAccessRequest } from '@shared/schema';

function getPublicAppUrl() {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  return "https://gardenofweeden-production.up.railway.app";
}

// Initialize SendGrid (only if API key is available)
let mailService: MailService | null = null;
if (process.env.SENDGRID_API_KEY) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email notification function
export async function sendNewSubscriberNotification(subscriberEmail: string) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email notification');
    return;
  }

  try {
    // Send notification to admin
    await mailService.send({
      to: 'manager.gardenofweeden@gmail.com',
      from: 'manager.gardenofweeden@gmail.com',
      subject: 'New Newsletter Subscriber - Garden of Weeden',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            🌿 New Newsletter Subscriber
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p><strong>Email:</strong> ${subscriberEmail}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Garden of Weeden Admin</strong></p>
            <p>Phone: (716) 420-1591 | Email: manager.gardenofweeden@gmail.com</p>
          </div>
        </div>
      `
    });
    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

export async function sendJobApplicationNotification(application: any) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email notification');
    return;
  }

  try {
    // Send notification to admin
    await mailService.send({
      to: 'manager.gardenofweeden@gmail.com',
      from: 'manager.gardenofweeden@gmail.com',
      subject: 'New Job Application - Garden of Weeden',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            💼 New Job Application
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Position:</strong> ${application.position}</p>
            <p><strong>Experience:</strong> ${application.experience}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `
    });
    console.log('Job application notification sent successfully');
  } catch (error) {
    console.error('Failed to send job application notification:', error);
  }
}

export async function sendWelcomeEmail(subscriberEmail: string) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping welcome email');
    return;
  }

  try {
    await mailService.send({
      to: subscriberEmail,
      from: 'manager.gardenofweeden@gmail.com',
      subject: 'Welcome to Garden of Weeden Newsletter! 🌿',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            Welcome to Garden of Weeden! 🌿
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Thank you for subscribing to our newsletter!</p>
            <p>You'll receive updates about:</p>
            <ul>
              <li>New Farm to Flame releases and local partner drops</li>
              <li>Forbidden Fruit lounge events and private booking updates</li>
              <li>Craft cannabis education and Garden of Weeden news</li>
              <li>Community updates from Buffalo and Western New York</li>
            </ul>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Garden of Weeden</strong></p>
            <p>Farm to Flame Cannabis in Buffalo, NY</p>
            <p>Phone: (716) 420-1591 | Email: manager.gardenofweeden@gmail.com</p>
            <p>Instagram: @GardenOfWeedenNY</p>
          </div>
        </div>
      `
    });
    console.log('Welcome email sent successfully to:', subscriberEmail);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function sendMeetingRequestNotification(request: MeetingRequest) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email notification');
    return;
  }

  try {
    await mailService.send({
      to: 'manager.gardenofweeden@gmail.com',
      from: 'manager.gardenofweeden@gmail.com',
      subject: 'New Expert Session Request - Garden of Weeden',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            📅 New Expert Session Request
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p><strong>Name:</strong> ${request.name}</p>
            <p><strong>Email:</strong> ${request.email}</p>
            <p><strong>Preferred Date:</strong> ${request.preferredDate}</p>
            <p><strong>Duration:</strong> ${request.duration} minutes</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
            <br>
            <h3>Topic/Discussion:</h3>
            <p style="background-color: white; padding: 15px; border-left: 3px solid #FFD700;">
              ${request.topic}
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send meeting request notification:', error);
  }
}

// Experience booking email functions
export async function sendExperienceBookingConfirmation(booking: any) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email confirmation');
    return;
  }

  try {
    // Send confirmation to customer
    await mailService.send({
      to: booking.email,
      from: 'manager.gardenofweeden@gmail.com',
      subject: 'Experience Booking Confirmed - Garden of Weeden',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            🌿 Thank You for Your Booking!
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi ${booking.name},</p>
            <p>Thank you for booking an experience with Garden of Weeden! We've received your request and will contact you within 24 hours to confirm availability and finalize the details.</p>
            
            <h3 style="color: #FFD700;">Your Booking Details:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0;">
              <p><strong>Experience Type:</strong> ${booking.eventType}</p>
              <p><strong>Preferred Date:</strong> ${booking.preferredDate}</p>
              <p><strong>Number of Guests:</strong> ${booking.guestCount}</p>
              <p><strong>Contact Phone:</strong> ${booking.phone}</p>
              ${booking.message ? `<p><strong>Special Requests:</strong> ${booking.message}</p>` : ''}
            </div>
            
            <p>We're excited to talk through your Garden of Weeden event in Western New York.</p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>We'll call you within 24 hours to confirm availability</li>
              <li>Final pricing and scheduling will be discussed</li>
              <li>Payment details will be provided upon confirmation</li>
            </ul>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Garden of Weeden</strong></p>
            <p>Phone: (716) 420-1591 | Email: manager.gardenofweeden@gmail.com</p>
            <p>Farm to Flame Cannabis - Buffalo, NY</p>
          </div>
        </div>
      `
    });
    console.log('Experience booking confirmation sent to:', booking.email);
  } catch (error) {
    console.error('Failed to send experience booking confirmation:', error);
  }
}

export async function sendExperienceBookingNotification(booking: any) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping admin notification');
    return;
  }

  try {
    // Send notification to admin
    await mailService.send({
      to: 'manager.gardenofweeden@gmail.com',
      from: 'manager.gardenofweeden@gmail.com',
      subject: 'New Experience Booking - Garden of Weeden',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            🎯 New Experience Booking Request
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            
            <h3>Booking Details:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0;">
              <p><strong>Experience Type:</strong> ${booking.eventType}</p>
              <p><strong>Preferred Date:</strong> ${booking.preferredDate}</p>
              <p><strong>Number of Guests:</strong> ${booking.guestCount}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
              ${booking.message ? `<p><strong>Special Requests:</strong><br>${booking.message}</p>` : ''}
            </div>
            
            <p><strong>⏰ Action Required:</strong> Contact customer within 24 hours to confirm availability and pricing.</p>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Garden of Weeden Admin Dashboard</strong></p>
            <p>Phone: (716) 420-1591 | Email: manager.gardenofweeden@gmail.com</p>
          </div>
        </div>
      `
    });
    console.log('Experience booking admin notification sent');
  } catch (error) {
    console.error('Failed to send experience booking admin notification:', error);
  }
}

// Investor access request email notifications
export async function sendInvestorAccessRequestNotification(request: InvestorAccessRequest) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email notification');
    return;
  }

  try {
    // Send notification to admin about new investor access request
    await mailService.send({
      to: 'manager.gardenofweeden@gmail.com',
      from: 'manager.gardenofweeden@gmail.com', 
      subject: `New Investor Access Request: ${request.firstName} ${request.lastName} - Garden of Weeden`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            🔑 New Investor Access Request
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h3>Applicant Information:</h3>
            <p><strong>Name:</strong> ${request.firstName} ${request.lastName}</p>
            <p><strong>Email:</strong> ${request.email}</p>
            <p><strong>Phone:</strong> ${request.phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${request.company || 'Not provided'}</p>
            <p><strong>Position:</strong> ${request.position || 'Not provided'}</p>
            
            <h3>Investment Details:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0;">
              <p><strong>Investment Interest:</strong> ${request.investmentInterest}</p>
              <p><strong>Net Worth:</strong> ${request.netWorth || 'Not provided'}</p>
              <p><strong>Investment Experience:</strong> ${request.investmentExperience || 'Not provided'}</p>
              <p><strong>Reason for Interest:</strong></p>
              <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 5px;">${request.reasonForInterest}</p>
              <p><strong>Submitted:</strong> ${new Date(request.createdAt || new Date()).toLocaleString()}</p>
            </div>
            
            <p><strong>⏰ Action Required:</strong> Review and approve/deny this investor access request in the admin portal.</p>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Garden of Weeden Investor Admin</strong></p>
            <p>Phone: (716) 420-1591 | Email: manager.gardenofweeden@gmail.com</p>
          </div>
        </div>
      `
    });
    console.log('Investor access request notification sent to admin');
  } catch (error) {
    console.error('Failed to send investor access request notification:', error);
  }
}

// Investor message email notifications
export async function sendInvestorMessageNotification(message: InvestorMessage) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email notification');
    return;
  }

  try {
    // Send notification to admin about new investor message
    await mailService.send({
      to: 'manager.gardenofweeden@gmail.com',
      from: 'manager.gardenofweeden@gmail.com',
      subject: `New Investor Message: ${message.subject} - Garden of Weeden`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            💼 New Investor Portal Message
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h3>Investor Information:</h3>
            <p><strong>Name:</strong> ${message.investorName}</p>
            <p><strong>Email:</strong> ${message.investorEmail}</p>
            <p><strong>Investor ID:</strong> ${message.investorId}</p>
            
            <h3>Message Details:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0;">
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 5px;">${message.message}</p>
              <p><strong>Received:</strong> ${new Date(message.createdAt || new Date()).toLocaleString()}</p>
            </div>
            
            <p><strong>⏰ Action Required:</strong> Respond to investor within 24 hours via portal admin or direct email.</p>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Garden of Weeden Investor Portal</strong></p>
            <p>Phone: (716) 420-1591 | Email: manager.gardenofweeden@gmail.com</p>
          </div>
        </div>
      `
    });
    console.log('Investor message notification sent to admin');
  } catch (error) {
    console.error('Failed to send investor message notification:', error);
  }
}

export async function sendInvestorReplyNotification(message: InvestorMessage) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping reply notification');
    return;
  }

  try {
    // Send reply notification to investor
    await mailService.send({
      to: message.investorEmail,
      from: 'manager.gardenofweeden@gmail.com',
      subject: `Reply to your message: ${message.subject} - Garden of Weeden`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            💬 Reply from Garden of Weeden Team
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h3>Your Original Message:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #ccc; margin: 15px 0;">
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 5px;">${message.message}</p>
            </div>
            
            <h3>Our Reply:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0;">
              <p style="white-space: pre-wrap; background-color: #fffef0; padding: 15px; border-radius: 5px; color: #333;">${message.adminReply}</p>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">
                <strong>Replied:</strong> ${new Date(message.repliedAt || new Date()).toLocaleString()}
              </p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>💡 Need to continue the conversation?</strong></p>
              <p>Log into the <a href="${getPublicAppUrl()}/investor-portal" style="color: #FFD700; text-decoration: none;"><strong>Investor Portal</strong></a> to send a follow-up message or contact us directly.</p>
            </div>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Garden of Weeden LLC - Investor Relations</strong></p>
            <p>Phone: (716) 420-1591 | Email: manager.gardenofweeden@gmail.com</p>
            <p style="font-size: 11px; color: #ccc; margin-top: 10px;">
              This is an automated message. Please do not reply directly to this email.
            </p>
          </div>
        </div>
      `
    });
    console.log(`Reply notification sent to investor: ${message.investorEmail}`);
  } catch (error) {
    console.error('Failed to send reply notification to investor:', error);
  }
}
