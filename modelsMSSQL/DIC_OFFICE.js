const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const DIC_OFFICE = sequelize.define(
    "DIC_OFFICE",
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      Index: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      ShortName: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      Position_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CreatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      UpdatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      DeletedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      FlagDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "DIC_OFFICE",
      schema: "dbo",
      timestamps: false,
      indexes: [
        {
          name: "PK_DIC_OFFICE",
          unique: true,
          fields: [{ name: "ID" }],
        },
      ],
    }
  );
  DIC_OFFICE.associate = function (models) {
    DIC_OFFICE.hasOne(models.DIC_OFFICE_CORRESPONDENCE, {
      onDelete: "CASCADE",
      foreignKey: "OFFICE_ID",
      as: "CORRESPONDENCE".toLowerCase(),
    });
  };
  return DIC_OFFICE;
};
