import type { TSave } from "@saves/adapters/save.schema"

export interface ISaveRepository {
    findSaveById(id: string): Promise<TSave | null>
    findSavesByUserId(id: string): Promise<TSave[]>
    createSave(save: TSave): Promise<TSave>
    deleteSave(id: string): Promise<TSave | null>
}
