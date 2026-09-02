import { RESTDataSource } from '@apollo/datasource-rest';

export class UserAPI extends RESTDataSource {
  override baseURL = 'https://jsonplaceholder.typicode.com/';

  async getUsers(): Promise<import('../types.ts').User[]> {
    return this.get('users');
  }

  async getUser(id: number): Promise<import('../types.ts').User | null> {
    try {
      return await this.get(`users/${id}`);
    } catch {
      return null;
    }
  }
}