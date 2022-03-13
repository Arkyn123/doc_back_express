module.exports = (sequelize, DataTypes) => {
    const Status = sequelize.define("DocumentStatus", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
