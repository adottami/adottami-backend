import Entity from '@/shared/entities/entity';

class User extends Entity {
  readonly name!: string;
  readonly email!: string;
  readonly password!: string;
  readonly phoneNumber!: string;

  private constructor({ id, createdAt, ...props }: User) {
    super({ id, createdAt });
    Object.assign(this, props);
  }

  static create(user: User) {
    const userCreated = new User(user);

    return userCreated;
  }

  static toJson(user: User) {
    const { id, name, email, phoneNumber, createdAt } = user;

    return {
      id,
      name,
      email,
      phoneNumber,
      createdAt,
    };
  }
}

export default User;
