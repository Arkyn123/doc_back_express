module.exports = (sequelize, DataTypes) => {
  const RouteCoordination = sequelize.define(
    "RouteCoordination",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING(128),
      },
      name: {
        type: DataTypes.STRING(128),
      },
      middlename: {
        type: DataTypes.STRING(128),
      },
      personalNumber: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
    }
  );
  RouteCoordination.associate = function (models) {
    // Джоины
    RouteCoordination.belongsTo(models.Document, { as: "document" });
    RouteCoordination.belongsTo(models.Status, { as: "status" });
  };
  return RouteCoordination;
};
