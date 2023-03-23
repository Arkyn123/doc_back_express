const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const T_XXHR_SCHEDULE_BRIGADES = sequelize.define(
    "T_XXHR_SCHEDULE_BRIGADES",
    {
      WORK_SCHEDULE_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      BRIGADE: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      BRIGADE: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "T_XXHR_SCHEDULE_BRIGADES",
      schema: "dbo",
      timestamps: false,
    }
  );
  T_XXHR_SCHEDULE_BRIGADES.removeAttribute('id');

  return T_XXHR_SCHEDULE_BRIGADES;
};
