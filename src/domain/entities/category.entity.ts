import { CustomError } from "../errors/custom.error";

export class CategoryEntity {
  private constructor(
    public id: string,
    public name: string,
    public available: boolean
  ) {}

  static fromObject(object: Record<string, any>) {
    const { id, _id, name, available = false } = object;
    let validatedAvailable = available

    if (!_id && !id) throw CustomError.badRequest("Missing id");
    if (!name) throw CustomError.badRequest("Missing name");
    if (typeof available === 'string' && available !== 'true') validatedAvailable = false

    return new CategoryEntity(
      _id || id,
      name,
      validatedAvailable
    );
  }
}
