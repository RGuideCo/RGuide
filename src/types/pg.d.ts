declare module "pg" {
  export class Client {
    constructor(config?: {
      connectionString?: string;
      ssl?: boolean | { rejectUnauthorized?: boolean };
    });
    connect(): Promise<void>;
    query<T = unknown>(text: string, values?: unknown[]): Promise<{ rows: T[] }>;
    end(): Promise<void>;
  }

  const pg: {
    Client: typeof Client;
  };

  export default pg;
}
