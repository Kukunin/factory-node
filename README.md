### factory-node

factory-node is a flexible library for DRY in unit and integration tests. Instead of defining sample (often hard-coded) data structures in every test, you work with the common mirror of your application models.

The library is heavily inspired by Ruby's ecosystem: [factory_bot](https://github.com/thoughtbot/factory_bot), [rspec](https://github.com/rspec/rspec-rails), [faker](https://github.com/faker-ruby/faker).

It implements TypeScript types safety for your factories in the first place. Partly, it explains the choice of DSL.

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

```ts
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

```ts
const userFactory = define()
  .attribute('name', () => 'Default Name')
  .attribute('age', () => 30)
  .trait('senior', (f) => f.attribute('age', () => 65))
  .trait('male', (f) => f.attribute('name', () => 'John'))
```

Once defined, you can use traits when building objects:

```ts
// Using a single trait
const seniorUser = await userFactory.build('senior')
// Result: { name: 'Default Name', age: 65 }

// Using multiple traits
const seniorMaleUser = await userFactory.build('senior', 'male')
// Result: { name: 'John', age: 65 }

// Combining traits with overrides
const customSeniorUser = await userFactory.build('senior', { name: 'Alice' })
// Result: { name: 'Alice', age: 65 }
```

## Future plans

- [ ] associations
- [ ] custom operations (integration with your ORM)
- [x] traits
- [ ] initialize_with function
- [ ] async attributes
