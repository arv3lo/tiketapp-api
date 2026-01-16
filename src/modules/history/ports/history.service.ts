import type { IHistoryFilter, IHistoryRepository } from "@history/ports/history.port";
import type { THistory } from "@history/adapters/mongodb/history.schema";
import type { THistoryData } from "@/common/types";

export class HistoryService {
    constructor(private readonly historyRepo: IHistoryRepository) { }

    async findHistory(filters?: IHistoryFilter): Promise<THistory[]> {
        return this.historyRepo.findHistory(filters);
    }

    async findHistoryById(id: string): Promise<THistory | null> {
        return this.historyRepo.findHistoryById(id);
    }

    async createHistory(data: THistoryData): Promise<THistory | null> {
        return this.historyRepo.createHistory(data);
    }
}