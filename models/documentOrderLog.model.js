module.exports = (sequelize, DataTypes) => {
  const OrderLog = sequelize.define(
    "DocumentOrderLog",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      documentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      statusDescription: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
      personalNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING(256),
      },
      registrationNumber: {
        type: DataTypes.STRING(128),
      },
    },
    {
      freezeTableName: true,
    }
  );
  return OrderLog;
};
