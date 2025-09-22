import type { TTicketCategory, TicketCategoryInput } from "@user-ticket-category/ports/ticket-category.schema";

export interface ITicketCategoryRepository {
    findCategoryById(id: string): Promise<TTicketCategory | null>
    findCategoryByEventId(eventId: string): Promise<TTicketCategory[]>
    createCategory(category: TicketCategoryInput): Promise<TTicketCategory>
    updateCategory(id: string, category: Partial<TicketCategoryInput>): Promise<TTicketCategory | null>
    deleteCategory(id: string): Promise<TTicketCategory | null>
}
