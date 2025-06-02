import { faker } from '@faker-js/faker'
import { SignupBody } from '@/infra/http/session/user.dto'

export class UserFactory {
  static createUser(data: Partial<SignupBody>): SignupBody {
    return {
      name: data.name || faker.person.fullName(),
      email: data.email || faker.internet.email(),
      nickname: data.nickname || faker.internet.username(),
      password: data.password || faker.internet.password({ length: 8 }),
    }
  }
}
