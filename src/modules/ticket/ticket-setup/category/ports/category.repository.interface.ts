import type { TCategoryInput, TCategory } from "@category/adapters/mongodb/category.schema";

export interface CategoryRepository {
    findCategories(): Promise<TCategory[]>
    // findCategoryById(id: string): Promise<TCategory | null>
    // findCategoryBySetupId(setupId: string): Promise<TCategory[]>
    createCategory(category: TCategoryInput): Promise<TCategory>
    deleteCategory(id: string): Promise<TCategory | null>
}
