const fs = require('fs')
const Mustache = require('mustache')

const Mailer = require('./Mailer')

class EmailConfirmationMailer {
  async send(to, token, subject = 'Confirme seu e-mail') {
    const rootDir = process.cwd()

    fs.readFile(
      `${rootDir}/src/assets/templates/emailConfirmation.html`, 
      'utf8', 
      function (err, html) {
        if (err) {
          throw err
        }

        const params = {
          link: `/public/users/check-email/${token}`,
        }

        const output = Mustache.render(html, params)
        Mailer.send(to, subject, output)
      })
  }
}

module.exports = new EmailConfirmationMailer()
