export class RecommendedTeacherResDto {
  private name!: string;
  private phone!: string;

  constructor(name: string, phone: string) {
    this.name = name;
    this.phone = phone;
  }
}
