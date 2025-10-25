import type { ISaveRepository } from "@saves/ports/save.port";
import type { TSaveInput } from "@saves/ports/save.port";
import type { TSave } from "@saves/adapters/mongodb/save.schema";

export class SaveService {
    constructor(private readonly saveRepository: ISaveRepository) { }

    async findSaveById(id: string): Promise<TSave | null> {
        return this.saveRepository.findSaveById(id);
    }

    async findSavesByUserId(id: string): Promise<TSave[]> {
        return this.saveRepository.findSavesByUserId(id);
    }

    async createSave(save: TSaveInput): Promise<TSave> {
        return this.saveRepository.createSave(save);
    }

    async deleteSave(id: string): Promise<TSave | null> {
        return this.saveRepository.deleteSave(id);
    }
}