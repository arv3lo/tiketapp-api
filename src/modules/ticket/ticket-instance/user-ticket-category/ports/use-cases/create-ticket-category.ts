import { TicketCategoryService } from "@user-ticket-category/ports/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory, {type TTicketCategory} from "@user-ticket-category/adapters/mongodb/ticket-category.schema";
import { ERROR_MESSAGE } from "@/common/enums";
import { type TicketCategoryInput } from "@user-ticket-category/ports/ticket-category.port";

const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory))

export const createTicketCategory = async (category: TicketCategoryInput): Promise<TTicketCategory> => {
    const createdCategory = await ticketCategoryService.createCategory(category)
    if (!createdCategory) throw new Error(ERROR_MESSAGE.NOT_CREATED)

    return createdCategory
}