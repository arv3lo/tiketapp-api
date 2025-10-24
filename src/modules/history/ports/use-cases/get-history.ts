import { HistoryService } from "@history/ports/history.service";
import { MongooseHistoryRepo } from "@history/adapters/mongodb/history.repo";
import History, { type THistory } from "@history/adapters/mongodb/history.schema";
import type { IHistoryFilter } from "@history/ports/history.port";
import { ERROR_MESSAGE } from "@/common/enums";

const historyService = new HistoryService(new MongooseHistoryRepo(History));

export const getHistory = async (filters?: IHistoryFilter): Promise<THistory[]> => {
    const history = await historyService.findHistory(filters);
    if (!history || history.length === 0) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return history;
}

export const getHistoryById = async (id: string): Promise<THistory | null> => {
    const history = await historyService.findHistoryById(id);
    if (!history) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return history;
}
