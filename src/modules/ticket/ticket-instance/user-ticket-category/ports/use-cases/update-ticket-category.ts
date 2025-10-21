import { TicketCategoryService } from "@/modules/ticket/ticket-instance/user-ticket-category/ports/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory, {type TTicketCategory} from "@user-ticket-category/adapters/mongodb/ticket-category.schema";
import { ERROR_MESSAGE } from "@/common/enums";
import { type TicketCategoryInput } from "@user-ticket-category/ports/ticket-category.port";

const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory))

export const updateTicketCategory = async (id: string, category: TicketCategoryInput): Promise<TTicketCategory> => {
    const updatedCategory = await ticketCategoryService.updateCategory(id, category)
    if (!updatedCategory) throw new Error(ERROR_MESSAGE.NOT_UPDATED)

    return updatedCategory
}

export const deleteTicketCategory = async (id: string): Promise<TTicketCategory> => {
    const deletedCategory = await ticketCategoryService.deleteCategory(id)
    if (!deletedCategory) throw new Error(ERROR_MESSAGE.NOT_DELETED)

    return deletedCategory
}