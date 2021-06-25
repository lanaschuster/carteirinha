const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Carteirinha - Express API with Swagger',
      version: '1.0.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Lana Schuster',
        email: 'info@email.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:9000',
      },
    ],
  },
  apis: [`${__dirname}/controllers/user.router.js`],
}

const specs = swaggerJsdoc(options)

module.exports = {
  docUrl: '/api-docs',
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, { explorer: true })
}
