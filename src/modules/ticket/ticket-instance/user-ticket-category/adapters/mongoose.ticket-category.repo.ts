import type { ITicketCategoryRepository } from "@user-ticket-category/ports/ticket-category.repository.interface";
import TicketCategory, { type TTicketCategory, type TicketCategoryInput } from "@user-ticket-category/ports/ticket-category.schema";

export class MongooseTicketCategoryRepo implements ITicketCategoryRepository {

    constructor(private readonly ticketCategory: typeof TicketCategory) { }

    async findCategoryById(id: string): Promise<TTicketCategory | null> {
        return this.ticketCategory.findById(id)
    }

    async findCategoryByEventId(eventId: string): Promise<TTicketCategory[]> {
        return this.ticketCategory.find({ event: eventId })
    }

    async createCategory(category: TicketCategoryInput): Promise<TTicketCategory> {
        return this.ticketCategory.create(category)
    }

    async bulkCreateCategories(categories: TicketCategoryInput[]): Promise<TTicketCategory[]> {
        return this.ticketCategory.insertMany(categories)
    }

    async updateCategory(id: string, category: Partial<TicketCategoryInput>): Promise<TTicketCategory | null> {
        return this.ticketCategory.findByIdAndUpdate(id, category, { new: true })
    }

    async deleteCategory(id: string): Promise<TTicketCategory | null> {
        return this.ticketCategory.findByIdAndDelete(id)
    }
}