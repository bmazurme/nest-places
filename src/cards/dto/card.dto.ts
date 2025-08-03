import { Card } from '../entities/card.entity';

export class CardDto {
  constructor(card: Card) {
    this.id = card.id;
    this.name = card.name;
    this.link = card.link;
    this.username = card.user.name;
    this.userid = card.user.id;
    this.likes = card.likes.map((like) => like.user.id);
  }

  id: number;
  name: string;
  link: string;
  username: string;
  userid: number;
  likes: number[];
}
