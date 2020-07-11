import { Client } from 'pg';
import { connectionString } from './utils/postgresql-database-url';

export class MainDataBaseController {
  private client: Client;
    
  constructor() {
    this.client = new Client({ connectionString: connectionString });
    this.client.connect();
  }

  public async query<T>(sqlQuery: string): Promise<Array<T>> {
    const result = await this.client.query<T>(sqlQuery);

    return result.rows;
  }
}