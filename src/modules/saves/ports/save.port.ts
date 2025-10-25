import z from "zod"

import type { TSave } from "@saves/adapters/mongodb/save.schema"

export interface ISaveRepository {
    findSaveById(id: string): Promise<TSave | null>
    findSavesByUserId(id: string): Promise<TSave[]>
    createSave(save: TSaveInput): Promise<TSave>
    deleteSave(id: string): Promise<TSave | null>
}

export const saveInput = z.object({
    user: z.string(),
    event: z.string()
})

export type TSaveInput = z.infer<typeof saveInput>

