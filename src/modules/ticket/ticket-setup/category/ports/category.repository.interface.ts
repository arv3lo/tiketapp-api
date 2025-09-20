import type { TCategoryInput, TCategory } from "@category/ports/category.schema";

export interface CategoryRepository {
    findCategoryById(id: string): Promise<TCategory | null>
    findCategoryBySetupId(setupId: string): Promise<TCategory[]>
    createCategory(category: TCategoryInput): Promise<TCategory>
    deleteCategory(id: string): Promise<TCategory | null>
}
