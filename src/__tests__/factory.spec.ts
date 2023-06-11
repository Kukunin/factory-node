import { define } from '../factory'

describe('Factory', () => {
  it('defines simple factories', () => {
    const factory = define((a) => {
      a.factory('user', (f) => {
        f.attribute('name', () => 'John')
      })
    })

    expect(factory.build('user')).toEqual({ name: 'John' })
  });
});
