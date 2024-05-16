import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { CategoryEntity } from "../../domain/entities/category.entity";

export class CategoryService {
  constructor() {}

  createCategoy = async (
    createCategoryDto: CreateCategoryDto,
    user: string
  ) => {
    const categoryExist = await CategoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (categoryExist) throw CustomError.badRequest("Category already exist");
    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user,
      });
      await category.save();
      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  };
  getCategories = async (paginationDto: PaginationDto) => {
    const { page, limit } = paginationDto;
    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      //* Alternative blocking way
      // const total = await CategoryModel.countDocuments()
      // const categories = await CategoryModel.find()
      //   .skip((page - 1) * limit)
      //   .limit(limit);

      return {
        page,
        limit,
        total,
        next: `/api/categories?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/categories?page=${page - 1}&limit=${limit}`
            : null,
        categories: categories.map((category) =>
          CategoryEntity.fromObject(category)
        ),
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  };
}
