const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Artisan Platform';
    const html = `
      <h1>Welcome to Artisan Platform, ${user.name}!</h1>
      <p>Thank you for joining our community. We're excited to have you on board.</p>
      <p>You can now start exploring our platform and connect with talented artisans.</p>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendOrderConfirmation(order, user) {
    const subject = 'Order Confirmation';
    const html = `
      <h1>Order Confirmation</h1>
      <p>Dear ${user.name},</p>
      <p>Your order #${order._id} has been confirmed.</p>
      <p>Total Amount: $${order.totalAmount}</p>
      <p>We will notify you when your order status changes.</p>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendOrderStatusUpdate(order, user) {
    const subject = 'Order Status Update';
    const html = `
      <h1>Order Status Update</h1>
      <p>Dear ${user.name},</p>
      <p>Your order #${order._id} status has been updated to: ${order.status}</p>
      <p>Thank you for shopping with us!</p>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendArtisanOrderNotification(order, artisan) {
    const subject = 'New Order Received';
    const html = `
      <h1>New Order Received</h1>
      <p>Dear ${artisan.name},</p>
      <p>You have received a new order #${order._id}.</p>
      <p>Total Amount: $${order.totalAmount}</p>
      <p>Please check your dashboard for order details.</p>
    `;

    return this.sendEmail(artisan.email, subject, html);
  }
}

module.exports = new EmailService();