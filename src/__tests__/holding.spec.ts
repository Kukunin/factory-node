import { newHolding } from '../holding';

describe('Factories holding', () => {
  const factory = newHolding().define('user', (f) =>
    f.attribute('name', () => 'abc').attribute('age', () => 18),
  );

  it('defines simple factories', async () => {
    const user = await factory.build('user');
    expect(user).toEqual({ name: 'abc', age: 18 });
  });

  it('allows to override values', async () => {
    const user = await factory.build('user', { name: 'another' });
    expect(user.name).toEqual('another');
    expect(user.age).toEqual(18);
  });

  describe('buildSync', () => {
    it('builds factories synchroniously', () => {
      const user = factory.buildSync('user');
      expect(user).toEqual({ name: 'abc', age: 18 });
    });
  })

  describe('initializeWith', () => {
    const factory = newHolding().define('user', (f) =>
      f.attribute('age', () => 18).initializeWith((result) => result.age),
    );

    it('allows to define initializeWith function', async () => {
      const age: number = await factory.build('user');
      expect(age).toEqual(18);
    })
  })
});
