import { define } from '../factory';

describe('Factory', () => {
  const factory = define()
    .attribute('name', () => 'abc')
    .attribute('age', () => 18);

  it('defines simple factories', async () => {
    const user = await factory.build();
    expect(user).toEqual({ name: 'abc', age: 18 });
  });

  it('allows to override values', async () => {
    const user = await factory.build({ name: 'another' });
    expect(user.name).toEqual('another');
    expect(user.age).toEqual(18);
  });

  it('does not evaluate default value if overwritten is provided', async () => {
    const mockName = jest.fn(() => 'default');
    const mockAge = jest.fn(() => 18);
    const factory = define().attribute('name', mockName).attribute('age', mockAge);

    await factory.build({ name: 'another' });

    expect(mockName).not.toHaveBeenCalled();
    expect(mockAge).toHaveBeenCalled();
  });

  describe('buildSync', () => {
    it('builds factories synchroniously', () => {
      const user = factory.buildSync();
      expect(user).toEqual({ name: 'abc', age: 18 });
    });
  })
});
