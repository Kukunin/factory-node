import { define } from '../holding';

describe('Factories holding', () => {
  const factory = define().factory('user', (f) =>
    f.attribute('name', () => 'abc').attribute('age', () => 18),
  );

  it('defines simple factories', () => {
    const user = factory.build('user');
    expect(user).toEqual({ name: 'abc', age: 18 });
  });

  it('allows to override values', () => {
    const user = factory.build('user', { name: 'another' });
    expect(user.name).toEqual('another');
    expect(user.age).toEqual(18);
  });
});
