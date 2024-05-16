import { envs } from "../../config";
import { CategoryModel } from "../mongo/models/category.model";
import { ProductModel } from "../mongo/models/product.model";
import { UserModel } from "../mongo/models/user.model";
import { MongoDatabase } from "../mongo/mongo-db";
import { seedData } from "./data";

(async () => {
  await MongoDatabase.connnect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });
  await main();

  await MongoDatabase.disconnect();
})();

const randomBetween0andX = (x: number) => {
  return Math.floor(Math.random() * x);
};

async function main() {
  // * Borrar todo
  await Promise.all([
    UserModel.deleteMany(), // this is equal to do a 'truncate'
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);
  // * Crear usuarios
  const users = await UserModel.insertMany(seedData.users);
  // * Crear categorias
  const categories = await CategoryModel.insertMany(
    seedData.categories.map((category) => ({
      ...category,
      user: users[randomBetween0andX(seedData.users.length - 1)].id,
    }))
  );

  // * Crear productos
  await ProductModel.insertMany(
    seedData.products.map((product) => ({
      ...product,
      user: users[randomBetween0andX(seedData.users.length - 1)].id,
      category:
        categories[randomBetween0andX(seedData.categories.length - 1)].id,
    }))
  );

  console.log("SEEDED");
}
