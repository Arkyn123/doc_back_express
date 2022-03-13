const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  DIC_OFFICE_CORRESPONDENCE = sequelize.define('DIC_OFFICE_CORRESPONDENCE', {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ORG_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PARENT_ORG_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OFFICE_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'DIC_OFFICE',
        key: 'ID'
      }
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DeletedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    FlagDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'DIC_OFFICE_CORRESPONDENCE',
    schema: 'dbo',
    timestamps: false
  });
  return DIC_OFFICE_CORRESPONDENCE;
};
