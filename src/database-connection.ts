import { DataSource } from "typeorm";
import { AppDataSource } from "./data-source";

type ConnectionState = {
  connected: boolean;
};

export class DatabaseConnection {
  private dataSource: DataSource;
  private connectionState: ConnectionState = {
    connected: false,
  };

  constructor() {
    this.dataSource = AppDataSource;
  }

  async init(): Promise<void> {
    if (this.connectionState.connected) {
      console.log("Database already connected");
      return;
    }

    try {
      await this.dataSource.initialize();
      this.connectionState.connected = true;
      console.log("Database connection established");
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      this.connectionState.connected = false;
      console.log("Database connection closed");
    }
  }

  isConnected(): boolean {
    return this.connectionState.connected;
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
