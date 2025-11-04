const { Sequelize, ForeignKeyConstraintError } = require('sequelize');
const path = require('path');
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', '');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
});

// Carregar os models
const Recurso = require('./recurso.js')(sequelize);
const Reserva = require('./reserva.js')(sequelize);

// Associações: Um recurso tem muitas reservas
Recurso.hasMany(Reserva, { as: 'reserva', foreignKey: 'recursoId', onDelete: 'CASCADE' });
Reserva.belongsTo(Recurso, { as: 'recurso', foreignKey: 'recursoId' });

module.exports = { sequelize, Recurso, Reserva };