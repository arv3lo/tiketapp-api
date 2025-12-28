import { HistoryService } from "@history/ports/history.service";
import { MongooseHistoryRepo } from "@history/adapters/mongodb/history.repo";
import History, { type THistory } from "@history/adapters/mongodb/history.schema";
import type { THistoryData } from "@/common/types";
import { ERROR_MESSAGE } from "@/common/enums";

const historyService = new HistoryService(new MongooseHistoryRepo(History));

export const createHistory = async (data: THistoryData): Promise<THistory | null> => {
    const history = await historyService.createHistory(data);
    if (!history) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return history;
}