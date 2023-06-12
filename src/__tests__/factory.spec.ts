import { define } from '../factory';

describe('Factory', () => {
  const factory = define()
    .attribute('name', () => 'abc')
    .attribute('age', () => 18);

  it('defines simple factories', () => {
    const user = factory.build();
    expect(user).toEqual({ name: 'abc', age: 18 });
  });

  it('allows to override values', () => {
    const user = factory.build({ name: 'another' });
    expect(user.name).toEqual('another');
    expect(user.age).toEqual(18);
  });

  it('does not evaluate default value if overwritten is provided', () => {
    const mockName = jest.fn(() => 'default');
    const mockAge = jest.fn(() => 18);
    const factory = define().attribute('name', mockName).attribute('age', mockAge);

    factory.build({ name: 'another' });

    expect(mockName).not.toHaveBeenCalled();
    expect(mockAge).toHaveBeenCalled();
  });
});
