import z from "zod";

import type { TTicketCategory } from "@user-ticket-category/adapters/mongodb/ticket-category.schema";

export interface ITicketCategoryRepository {
    findCategoryById(id: string): Promise<TTicketCategory | null>
    findCategoryByEventId(eventId: string): Promise<TTicketCategory[]>
    createCategory(category: TicketCategoryInput): Promise<TTicketCategory>
    bulkCreateCategories(categories: TicketCategoryInput[]): Promise<TTicketCategory[]>
    updateCategory(id: string, category: Partial<TicketCategoryInput>): Promise<TTicketCategory | null>
    deleteCategory(id: string): Promise<TTicketCategory | null>
}

export const ticketCategoryInput = z.object({
    name: z.string().min(3).max(100),
    description: z.string(),
    event: z.string(),
    price: z.number().optional(),
    availableAmount: z.number().optional().default(0),
    isAvailable: z.boolean().optional().default(true),
    releaseDate: z.date().optional().default(undefined),
    refund: z.boolean().optional().default(false)
})

export type TicketCategoryInput = z.infer<typeof ticketCategoryInput>
export const validateTicketCategoryInput = (input: TicketCategoryInput) => ticketCategoryInput.parse(input)