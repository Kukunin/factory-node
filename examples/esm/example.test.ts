import { holding } from 'factory-node';

describe('ESM Example', () => {
  it('should create a factory and build an object', async () => {
    const factories = holding()
      .define('user', (f) => f
        .attribute('name', () => 'Jane Doe')
        .attribute('age', () => 25)
      );

    const user = await factories.build('user');
    expect(user).toEqual({ name: 'Jane Doe', age: 25 });
  });
});