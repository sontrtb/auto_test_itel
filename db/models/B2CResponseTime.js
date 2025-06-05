import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const B2CResponseTime = sequelize.define(
  'B2C_ResponseTime',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    buyNowTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    packgeTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
  },
  {
    tableName: 'B2C_ResponseTime',
    updatedAt: false
  }
);

export {B2CResponseTime}
