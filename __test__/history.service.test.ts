import { describe, it, expect, mock } from "bun:test";
import { HistoryService } from "../src/modules/history/ports/history.service";
import type { IHistoryRepository } from "../src/modules/history/ports/history.port";
import type { THistory } from "../src/modules/history/adapters/mongodb/history.schema";

describe("HistoryService", () => {
    const historyRepositoryMock: IHistoryRepository = {
        findHistory: mock(() => Promise.resolve([])),
        findHistoryById: mock((id: string) => Promise.resolve({} as THistory)),
    };

    const historyService = new HistoryService(historyRepositoryMock);

    it("should find history", async () => {
        await historyService.findHistory();
        expect(historyRepositoryMock.findHistory).toHaveBeenCalled();
    });

    it("should find history by id", async () => {
        await historyService.findHistoryById("1");
        expect(historyRepositoryMock.findHistoryById).toHaveBeenCalledWith("1");
    });
});
