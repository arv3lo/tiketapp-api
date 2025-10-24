import type { CategoryRepository, TCategoryInput } from "@category/ports/category.port";
import type { TCategory } from "@category/adapters/mongodb/category.schema";

export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) { }

    async findCategories(): Promise<TCategory[]> {
        return this.categoryRepository.findCategories();
    }

    // async findCategoryById(id: string): Promise<TCategory | null> {
    //     return this.categoryRepository.findCategoryById(id);
    // }

    // async findCategoryBySetupId(setupId: string): Promise<TCategory[]> {
    //     return this.categoryRepository.findCategoryBySetupId(setupId);
    // }

    async createCategory(category: TCategoryInput): Promise<TCategory> {
        return this.categoryRepository.createCategory(category);
    }

    async deleteCategory(id: string): Promise<TCategory | null> {
        return this.categoryRepository.deleteCategory(id);
    }
}