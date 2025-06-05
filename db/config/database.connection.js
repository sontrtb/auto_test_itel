import { Sequelize } from 'sequelize';
import configDatabase from './database.js';

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.sequelize = new Sequelize({
      ...configDatabase,
      pool: {
        max: 20, // Maximum number of connection in pool
        min: 5, // Minimum number of connection in pool
        acquire: 60000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
        idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
      },
      retry: {
        max: 3, // Maximum amount of times to retry
        timeout: 30000, // Maximum time to wait for a response, in milliseconds
      },
      dialectOptions: {
        connectTimeout: 60000, // Increase connection timeout
      },
      logging: false,
      // process.env.NODE_ENV === 'development' ? console.log : false,
    });

    Database.instance = this;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log(
        '✅ Database connection has been established successfully.',
      );
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.sequelize.close();
      console.log('Database connection closed successfully');
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

// Export a singleton instance
const db = Database.getInstance();
const sequelize = db.sequelize;

export { db, sequelize };

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    await db.disconnect();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});