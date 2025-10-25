import { SaveService } from "@saves/ports/save.service";
import { MongooseSaveRepo } from "@saves/adapters/mongodb/save.repo";
import Save, { type TSave } from "@saves/adapters/mongodb/save.schema";
import { ERROR_MESSAGE } from "@/common/enums";

const saveService = new SaveService(new MongooseSaveRepo(Save))

export const findSaveById = async(id: string): Promise<TSave | null> => {
    const save = await saveService.findSaveById(id)

    if(!save) throw new Error(ERROR_MESSAGE.NOT_FOUND)

    return save
}

export const findSavesByUserId = async(id: string): Promise<TSave[]> => {
    const saves = await saveService.findSavesByUserId(id)

    if(!saves) throw new Error(ERROR_MESSAGE.NOT_FOUND)

    return saves
}