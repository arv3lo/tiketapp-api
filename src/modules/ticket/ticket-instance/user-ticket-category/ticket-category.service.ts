import type { ITicketCategoryRepository } from "@user-ticket-category/ports/ticket-category.repository.interface";
import type { TicketCategoryInput, TTicketCategory } from "@user-ticket-category/ports/ticket-category.schema";

export class TicketCategoryService {
    constructor(private readonly ticketCategoryRepository: ITicketCategoryRepository) { }

    async findCategoryById(id: string): Promise<TTicketCategory | null> {
        return this.ticketCategoryRepository.findCategoryById(id)
    }

    async findCategoryByEventId(eventId: string): Promise<TTicketCategory[]> {
        return this.ticketCategoryRepository.findCategoryByEventId(eventId)
    }

    async createCategory(category: TicketCategoryInput): Promise<TTicketCategory> {
        return this.ticketCategoryRepository.createCategory(category)
    }

    async updateCategory(id: string, category: Partial<TicketCategoryInput>): Promise<TTicketCategory | null> {
        return this.ticketCategoryRepository.updateCategory(id, category)
    }

    async deleteCategory(id: string): Promise<TTicketCategory | null> {
        return this.ticketCategoryRepository.deleteCategory(id)
    }
}