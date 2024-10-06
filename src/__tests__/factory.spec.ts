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

  describe('traits', () => {
    const withTraits = factory
      .trait('senior', (f) => f.attribute('age', () => 65))
      .trait('male', (f) => f.attribute('name', () => 'John'))

    it('evaluates attributes by default', async () => {
      expect((await withTraits.build())).toEqual({ name: 'abc', age: 18 })
    })

    it('allows to pass trait', async () => {
      expect((await withTraits.build('senior'))).toEqual({ name: 'abc', age: 65 })
    })

    it('allows mixing traits with overrides', async () => {
      expect((await withTraits.build('senior', { name: 'Sam' }))).toEqual({ name: 'Sam', age: 65 })
    })

    it('supports multiple traits', async () => {
      expect((await withTraits.build('senior', 'male'))).toEqual({ name: 'John', age: 65 })
    })

    it('ensures trait cannot change the original type of a property', async () => {
      const myFactory = factory.trait('invalidAgeTrait', (f) =>
        // @ts-expect-error: "Trait should return the same type as the factory"
        f.attribute('age', () => 'not a number')
        // @ts-expect-error: "Trait can't add new attributes"
         .attribute('gender', () => 'female')
      );
      const user = await myFactory.build();
      expect('gender' in user).toBeFalsy();
    });

    it('ensures traits cannot be nested', () => {
      factory.trait('nestedTrait', (f) => {
        expect(() => f.trait()).toThrow('Traits cannot be nested');
        return f;
      });
    });
  })

  describe('initializeWith', () => {
    it('allows to define initializeWith function', async () => {
      const ageFactory = factory.initializeWith((result) => result.age);
      const age: number = await ageFactory.build()
      expect(age).toEqual(18)
    })

    it('respects the return type of initializeWith', async () => {
      const ageFactory = factory.initializeWith((result) => result.age);
      // @ts-expect-error: "initializeWith should return integer in this case"
      const age: string = await ageFactory.build()
      expect(age).toEqual(18)
    })

    it('allows to define attributes after initializeWith', async () => {
      const myFactory = factory.initializeWith((result) => result).attribute('gender', () => 'female');
      const user = await myFactory.build()
      expect(user.gender).toEqual('female')
    })
  })
});
