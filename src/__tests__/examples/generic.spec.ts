import { faker } from '@faker-js/faker'
import { holding } from '../../index'

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

describe('factory generic example', () => {
  it('builds post with associated user', async () => {
    const post = await factory.build('post')
    console.log(post)
    expect(post.userId).not.toBeNull()
  })
})
