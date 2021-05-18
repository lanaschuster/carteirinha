'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createSchema('user')
    await queryInterface.createSchema('business')

    await queryInterface.createTable('categories',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        description: {
          type: Sequelize.STRING(60),
          allowNull: false
        },
        name: {
          type: Sequelize.STRING(14),
          allowNull: false
        },
        type: {
          type: Sequelize.ENUM,
          values: [
            'INCOME',
            'EXPENSE',
          ]
        },
      }, 
      {
        charset: 'utf8',
        schema: 'business',
        collate: 'utf8_swedish_ci'
      }
    )

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING
      }
    }, {
      charset: 'utf8',
      schema: 'business',
      collate: 'utf8_swedish_ci'
    })

    await queryInterface.createTable('expenses',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        description: {
          type: Sequelize.STRING(45),
          allowNull: false
        },
        value: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        date: {
          type: Sequelize.DATE
        },
        categoryId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'business.categories',
            key: 'id'
          },
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'business.users',
            key: 'id'
          },
        }
      }, 
      {
        charset: 'utf8',
        schema: 'business',
        collate: 'utf8_swedish_ci'
      }
    )

    await queryInterface.createTable('incomings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      description: {
        type: Sequelize.STRING(45)
      },
      value: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'business.categories',
          key: 'id'
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'business.users',
          key: 'id'
        },
      }
    }, {
      charset: 'utf8',
      schema: 'business',
      collate: 'utf8_swedish_ci'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropAllTables()
    await queryInterface.dropAllSchemas()
  }
};
