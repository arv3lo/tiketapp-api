import { TicketCategoryService } from "@/modules/ticket/ticket-instance/user-ticket-category/ports/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory, { type TTicketCategory } from "@user-ticket-category/adapters/mongodb/ticket-category.schema";

import { ERROR_MESSAGE } from "@/common/enums"; 

const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory))

export const getTicketCategories = async (eventId: string): Promise<TTicketCategory[]> => {
    const categories = await ticketCategoryService.findCategoryByEventId(eventId)
    if (!categories) throw new Error(ERROR_MESSAGE.NOT_FOUND)

    return categories
}

export const getTicketCategory = async (id: string): Promise<TTicketCategory | null> => {
    const category = await ticketCategoryService.findCategoryById(id)
    if (!category) throw new Error(ERROR_MESSAGE.NOT_FOUND)

    return category
}