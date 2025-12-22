import sequelize from "../config/sequelize.js";
import { DataTypes, Model } from "sequelize";

interface BookAttributes {
  id?: number;
  title: string;
  author: string;
  count: number;
  requests: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Book extends Model<BookAttributes> implements BookAttributes {
  public id!: number;
  public title!: string;
  public author!: string;
  public count!: number;
  public requests!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    requests: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "books",
    timestamps: true,
    paranoid: true,
  }
);
export default Book;
