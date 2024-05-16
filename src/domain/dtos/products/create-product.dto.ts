import { Validators } from "../../../config/validators";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string, // ID user
    public readonly category: string // ID category
  ) {}

  static create(props: Record<string, any>): [string?, CreateProductDto?] {
    const { name, available, price, description, user, category } = props;

    if (!name) return ["Missing name"];
    if (!user) return ["Missing user"];
    if (user && !Validators.isMongoId(user)) return ["Invalid user ID"];
    if (!category) return ["Missing category"];
    if (!Validators.isMongoId(category)) return ["Invalid category ID"];

    return [
      undefined,
      new CreateProductDto(
        name,
        !!available,
        price,
        description,
        user,
        category
      ),
    ];
  }
}
