### factory-node

factory-node is a flexible library for DRY in unit and integration tests. Instead of defining sample (often hard-coded) data structures in every test, you work with the common mirror of your application models.

The library is heavily inspired by Ruby's ecosystem: [factory_bot](https://github.com/thoughtbot/factory_bot), [rspec](https://github.com/rspec/rspec-rails), [faker](https://github.com/faker-ruby/faker).

It implements TypeScript types safety for your factories in the first place. Partly, it explains the choice of DSL. The factories, attributes and traits are immutable, meaning that you need to always use the returned object. There are no in-place mutations because Typescript does not allow to mutate type for an instance.

## Installation

Install using yarn:

```
yarn add -D factory-node
```

Install using npm:

```
npm install --save-dev factory-node
```

## Example

### Generic example

```typescript
import { faker } from '@faker-js/faker'
import { holding } from 'factory-node'

const factory = holding()
  .define('user', (f) => (
    f.attribute('id', () => faker.string.uuid())
     .attribute('username', () => faker.internet.userName())
     .attribute('email', () => faker.internet.email())
     .attribute('password', () => faker.internet.password())
  ))
  .define('post', (f) => (
    f.attribute('userId', () => faker.string.uuid())
     .attribute('title', () => faker.lorem.sentence())
     .attribute('body', () => faker.lorem.paragraphs())
  ))

const post = await factory.build('post')
```

## Features

### Traits

Traits allow you to create variations of your factory without duplicating code. They are particularly useful when you need to create objects with specific characteristics or states.

*Traits don't change the original factory definition, so you can't change attributes return types or add new attributes.*

You can define traits using the `trait` method on your factory. Each trait is a function that modifies the factory's attributes.

```typescript
import { holding } from 'factory-node'

const factory = holding().define('user', (f) => (
  f.attribute('name', () => 'Default Name')
   .attribute('age', () => 30)
   .trait('senior', (f) => f.attribute('age', () => 65))
   .trait('male', (f) => f.attribute('name', () => 'John'))
))
```

Once defined, you can use traits when building objects:

```typescript
// Using a single trait
const seniorUser = await userFactory.build('user', 'senior')
// Result: { name: 'Default Name', age: 65 }

// Using multiple traits
const seniorMaleUser = await userFactory.build('user', 'senior', 'male')
// Result: { name: 'John', age: 65 }

// Combining traits with overrides
const customSeniorUser = await userFactory.build('user', 'senior', { name: 'Alice' })
// Result: { name: 'Alice', age: 65 }
```

### InitializeWith

The `initializeWith` method allows you to customize the final output of your factory. This is particularly useful when you want to return instances of specific classes instead of plain JavaScript objects.

Here's an example of how to use `initializeWith` with a sample User model:

```typescript
import { holding } from 'factory-node'

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

const factory = holding().define('user', (f) =>
  f.attribute('name', () => 'John Doe')
   .attribute('age', () => 30)
   .initializeWith((attrs) => new User(attrs))
);

const user = await holding.build('user');
console.log(user instanceof User); // true
console.log(user.greet()); // "Hello, I'm John Doe and I'm 30 years old."

// You can still override attributes
const youngUser = await holding.build('user', { age: 18 });
console.log(youngUser.greet()); // "Hello, I'm John Doe and I'm 18 years old."
```

## Future plans

- [x] traits
- [x] initialize_with function
- [ ] associations
- [ ] custom operations (integration with your ORM)
- [ ] async attributes
- [ ] definition files
