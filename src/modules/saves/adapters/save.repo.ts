import type { ISaveRepository } from "@saves/ports/save.port";
import Save, { type TSave } from "@saves/adapters/save.schema";

export class MongooseSaveRepo implements ISaveRepository {
    constructor(private readonly saveModel: typeof Save) { }

    async findSaveById(id: string): Promise<TSave | null> {
        return this.saveModel.findById(id).lean()
    }

    async findSavesByUserId(id: string): Promise<TSave[]> {
        return this.saveModel.find({ user: id }).lean()
    }

    async createSave(save: TSave): Promise<TSave> {
        return this.saveModel.create(save)
    }

    async deleteSave(id: string): Promise<TSave | null> {
        return this.saveModel.findByIdAndDelete(id).lean()
    }
}