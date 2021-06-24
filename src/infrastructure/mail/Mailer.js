const nodemailer = require('nodemailer')

class Mailer {
  async send(to, subject, html) {
    const config = await this.configure()
    let transporter = nodemailer.createTransport(config)
    let info = await transporter.sendMail({
      from: process.env.NOREPLAY_MAIL,
      to: to,
      subject: subject,
      html: html
    })

    if (process.env.NODE_ENV === 'local')
      console.log("URL: %s", nodemailer.getTestMessageUrl(info))
  }

  async configure() {
    let config

    if (process.env.NODE_ENV === 'local') {
      let testAccount = await nodemailer.createTestAccount()
      config = {
        host: 'smtp.ethereal.email',
        auth: testAccount
      }
    } else {
      config = {
        secure: true,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          pass: process.env.SMTP_PASS,
          user: process.env.SMTP_USER
        }
      }
    }

    return config
  }
}

module.exports = new Mailer()
