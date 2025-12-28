import type { IPaginationFields } from "@/common/interfaces";
import type { THistory } from "@history/adapters/mongodb/history.schema";
import type { THistoryData } from "@/common/types";

export interface IHistoryRepository {
    findHistory(filters?: IHistoryFilter): Promise<THistory[]>;
    findHistoryById(id: string): Promise<THistory | null>;
    createHistory(data: THistoryData): Promise<THistory | null>;
}

export interface IHistoryFilter extends IPaginationFields {
    model?: string;
    obj?: string;
    type?: string;
    user?: string;
}
    
