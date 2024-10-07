const { holding } = require('factory-node');

describe('CJS JS Example', () => {
  it('should create a factory and build an object', async () => {
    const factories = holding()
      .define('user', (f) => f
        .attribute('name', () => 'John Doe')
        .attribute('age', () => 30)
      );

    const user = await factories.build('user');
    expect(user).toEqual({ name: 'John Doe', age: 30 });
  });
});