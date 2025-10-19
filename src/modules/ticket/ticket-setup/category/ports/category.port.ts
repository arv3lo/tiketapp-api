import z from "zod"

import type { TCategory } from "@category/adapters/mongodb/category.schema";

export interface CategoryRepository {
    findCategories(): Promise<TCategory[]>
    // findCategoryById(id: string): Promise<TCategory | null>
    // findCategoryBySetupId(setupId: string): Promise<TCategory[]>
    createCategory(category: TCategoryInput): Promise<TCategory>
    deleteCategory(id: string): Promise<TCategory | null>
}

export const categoryInput = z.object({
    name: z.string().min(3).max(100),
    description: z.string().optional(),
    userId: z.string()
})

export type TCategoryInput = z.infer<typeof categoryInput>
export const validateCategoryInput = (input: TCategoryInput) => categoryInput.parse(input)
