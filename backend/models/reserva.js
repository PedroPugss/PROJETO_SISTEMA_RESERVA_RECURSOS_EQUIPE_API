const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Reserva', {
        recursoId: { type: DataTypes.INTEGER, allowNull: false },
        usarioId: { type: DataTypes.STRING, allowNull: false },
        starAt: { type: DataTypes.DATE, allowNull: false },
        endAt: { type: DataTypes.DATE, allowNull: false },
        justificativa: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pendente' }
    }, {
        tableName: 'reservas',
        timestamps: true
    });
};