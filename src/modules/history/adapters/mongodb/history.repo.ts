import type { IHistoryFilter, IHistoryRepository } from "@history/ports/history.port";
import History, { type THistory } from "@history/adapters/mongodb/history.schema";

// TODO: to be tested
export class MongooseHistoryRepo implements IHistoryRepository {
    constructor(private readonly history: typeof History) { }

    async findHistory(filters?: IHistoryFilter): Promise<THistory[]> {
        return this.history.find(filters || {})
            .skip(((filters?.page || 1) - 1) * (filters?.limit || 10))
            .limit(filters?.limit || 10)
            .sort({ [filters?.sort || 'createdAt']: filters?.order === "asc" ? 1 : -1 })
            .lean()
    }

    async findHistoryById(id: string): Promise<THistory | null> {
        return this.history.findById(id).lean()
    }
}