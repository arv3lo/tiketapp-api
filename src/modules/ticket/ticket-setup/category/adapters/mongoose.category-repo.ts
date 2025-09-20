import type { CategoryRepository } from "@category/ports/category.repository.interface";
import Category, { type TCategory, type TCategoryInput } from "@category/ports/category.schema";

export class MongooseCategoryRepo implements CategoryRepository {
    constructor(private readonly category: typeof Category) { }

    findCategoryById(id: string): Promise<TCategory | null> {
        return this.category.findById(id)
    }

    findCategoryBySetupId(setupId: string): Promise<TCategory[]> {
        return this.category.find({ setup: setupId })
    }

    createCategory(category: TCategoryInput): Promise<TCategory> {
        return this.category.create(category)
    }

    deleteCategory(id: string): Promise<TCategory | null> {
        return this.category.findByIdAndDelete(id)
    }
}