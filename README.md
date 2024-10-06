### factory-node

factory-node is a flexible library for DRY in unit and integration tests. Instead of defining sample (often hard-coded) data structures in every test, you work with the common mirror of your application models.

The library is heavily inspired by Ruby's ecosystem: [factory_bot](https://github.com/thoughtbot/factory_bot), [rspec](https://github.com/rspec/rspec-rails), [faker](https://github.com/faker-ruby/faker).

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
import { factory } from 'factory-node'

factory.define('user', (f) => (
  f.attribute('id', () => faker.string.uuid())
   .attribute('username', () => faker.internet.userName())
   .attribute('email', () => faker.internet.email())
   .attribute('password', () => faker.internet.password())
))

factory.define('post, (f) => (
  f.attribute('id', () => this.build('user').id)
   .attribute('title', () => faker.lorem.sentence())
   .attribute('body', () => faker.lorem.paragraphs())
))

const post = await factory.build('post')
console.log(post)
```
