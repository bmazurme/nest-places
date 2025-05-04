import { User } from 'src/users/entities/user.entity';

export class CreateLikeDto {
  card: { id: number };

  user: User;
}
