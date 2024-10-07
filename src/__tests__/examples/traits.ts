import { holding } from '../../index'

describe('traits', () => {
  const factory = holding().define('user', (f) => (
    f.attribute('name', () => 'Default Name')
    .attribute('age', () => 30)
    .trait('senior', (f) => f.attribute('age', () => 65))
    .trait('male', (f) => f.attribute('name', () => 'John'))
  ))

  it('builds a user with a single trait', async () => {
    const seniorUser = await factory.build('user', 'senior');
    expect(seniorUser).toEqual({ name: 'Default Name', age: 65 });
  });

  it('builds a user with multiple traits', async () => {
    const seniorMaleUser = await factory.build('user', 'senior', 'male');
    expect(seniorMaleUser).toEqual({ name: 'John', age: 65 });
  });

  it('builds a user combining traits with overrides', async () => {
    const customSeniorUser = await factory.build('user', 'senior', { name: 'Alice' });
    expect(customSeniorUser).toEqual({ name: 'Alice', age: 65 });
  });
})
