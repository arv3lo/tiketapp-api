import type { ITicketCategoryRepository, TicketCategoryInput } from "@user-ticket-category/ports/ticket-category.port";
import TicketCategory, { type TTicketCategory } from "@user-ticket-category/adapters/mongodb/ticket-category.schema";

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
        const createdCategories = await this.ticketCategory.insertMany(categories)
        return createdCategories.map(doc => doc.toObject() as unknown as TTicketCategory)
    }

    async updateCategory(id: string, category: Partial<TicketCategoryInput>): Promise<TTicketCategory | null> {
        return this.ticketCategory.findByIdAndUpdate(id, category, { new: true })
    }

    async deleteCategory(id: string): Promise<TTicketCategory | null> {
        return this.ticketCategory.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    }
}