import type { CategoryRepository, TCategoryInput } from "@/modules/ticket/ticket-setup/category/ports/category.port";
import Category, { type TCategory } from "@category/adapters/mongodb/category.schema";

export class MongooseCategoryRepo implements CategoryRepository {
    constructor(private readonly category: typeof Category) { }

    findCategories(): Promise<TCategory[]> {
        return this.category.find()
    }

    // findCategoryById(id: string): Promise<TCategory | null> {
    //     return this.category.findById(id)
    // }

    // findCategoryBySetupId(setupId: string): Promise<TCategory[]> {
    //     return this.category.find({ setup: setupId })
    // }

    createCategory(category: TCategoryInput): Promise<TCategory> {
        return this.category.create(category)
    }

    deleteCategory(id: string): Promise<TCategory | null> {
        return this.category.findByIdAndDelete(id)
    }
}