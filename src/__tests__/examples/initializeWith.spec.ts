import { holding } from '../../index'

class User {
  private name: string;
  private age: number;

  constructor(props: { name: string; age: number }) {
    this.name = props.name;
    this.age = props.age;
  }

  greet() {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old.`;
  }
}

describe('initializeWith', () => {
  const factory = holding().define('user', (f) =>
    f.attribute('name', () => 'John Doe')
     .attribute('age', () => 30)
     .initializeWith((attrs) => new User(attrs))
  );

  it('creates a User instance with default attributes', async () => {
    const user = await factory.build('user');
    expect(user instanceof User).toBe(true);
    expect(user.greet()).toBe("Hello, I'm John Doe and I'm 30 years old.");
  });

  it('allows overriding attributes when creating a User instance', async () => {
    const youngUser = await factory.build('user', { age: 18 });
    expect(youngUser.greet()).toBe("Hello, I'm John Doe and I'm 18 years old.");
  });
})