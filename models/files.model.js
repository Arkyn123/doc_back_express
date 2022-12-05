module.exports = (sequelize, DataTypes) => {
    const DocumentFile = sequelize.define(
      "DocumentFile",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        id_file: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        documentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        fullpath: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        file: {
          type: DataTypes.STRING(512),
          allowNull: false,
        },
        employeeNumberAddFile: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        statusDelete: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        }
      },
      {
        freezeTableName: true,
      }
    );
    return DocumentFile;
  };
  