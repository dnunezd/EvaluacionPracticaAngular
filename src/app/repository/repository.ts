export class Repository {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  ownerId: number;
  createdAt: string;

  constructor(
    id: number,
    name: string,
    description: string,
    language: string,
    stars: number,
    ownerId: number,
    createdAt: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.language = language;
    this.stars = stars;
    this.ownerId = ownerId;
    this.createdAt = createdAt;
  }
}
