// Cockroach client
var Sequelize = require('sequelize-cockroachdb');
var sequelize = new Sequelize('polaris', 'root', '', {
  dialect: 'postgres',
  port: 26257,
  logging: false
});

// Define the Sms model for the "polaris_sms" table.
export const Sms = sequelize.define('polaris_sms', {
  id: {
      type: Sequelize.UUID,
      primaryKey: true,
  },
  from_number: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  to_number: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
  },
  data: {
    type: Sequelize.JSONB,
  },
  deleted_at: {
    type: Sequelize.DATE,
  },
});

export const createSms = (id, from, to, body, data) => {
  return {
    id: id,
    from_number: from,
    to_number: to,
    body: body,
    data: data
  }
}
