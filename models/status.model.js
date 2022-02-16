module.exports = (sequelize, DataTypes) => {
    const Status = sequelize.define("Status", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(512),
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    return Status;
}
