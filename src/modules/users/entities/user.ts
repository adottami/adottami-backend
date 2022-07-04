import Entity, { EntityProps } from '@/shared/entities/entity';

interface UserProps extends EntityProps {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

class User extends Entity {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly phoneNumber: string;

  private constructor({ id, name, email, password, phoneNumber, createdAt }: UserProps) {
    super({ id, createdAt });
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
  }

  static create(userProps: UserProps) {
    const user = new User(userProps);

    return user;
  }

  toJson() {
    const { id, name, email, phoneNumber, createdAt } = this;

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
