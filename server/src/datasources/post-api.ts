import { RESTDataSource } from '@apollo/datasource-rest';

export class PostAPI extends RESTDataSource {
  override baseURL = 'https://jsonplaceholder.typicode.com/';

  async getPosts(): Promise<import('../types.ts').Post[]> {
    return this.get('posts');
  }

  async getComments(): Promise<import('../types.ts').Comment[]> {
    return this.get('comments');
  }
}