import { MongooseSaveRepo } from "@saves/adapters/mongodb/save.repo";
import Save, { type TSave } from "@saves/adapters/mongodb/save.schema";
import { SaveService } from "@saves/ports/save.service";
import type { TSaveInput } from "@saves/ports/save.port";
import { ERROR_MESSAGE } from "@/common/enums";

const saveService = new SaveService(new MongooseSaveRepo(Save))

export const createSave = async(savePayload: TSaveInput): Promise<TSave> => {
    const save = await saveService.createSave(savePayload)

    if(!save) throw new Error(ERROR_MESSAGE.NOT_FOUND)

    return save
}

export const deleteSave = async(id: string): Promise<TSave | null> => {
    const save = await saveService.deleteSave(id)

    if(!save) throw new Error(ERROR_MESSAGE.NOT_FOUND)

    return save
}