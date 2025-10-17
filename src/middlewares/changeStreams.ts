import type { ChangeStream } from 'mongodb';

import User from '@/modules/user/adapters/mongodb/user.schema';
import type { MongoChangeStreamPipeline } from '@/common/types';

export function closeChangeStream(timeInMs = 60000, changeStream: ChangeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve(true);
        }, timeInMs)
    })
};


export async function monitorUserChangeUsingEventEmitter(timeInMs = 60000, pipeline: MongoChangeStreamPipeline = []) {
    const changeStream = User.watch(pipeline);

    changeStream.on('change', (next) => {
        console.log(next)
    })

    // await closeChangeStream(timeInMs, changeStream)
}

export async function main() {
    const pipeline: MongoChangeStreamPipeline = [
        {
            $match: {
                operationType: 'insert',
                // 'fullDocument.address.country': 'Australia',
                // 'fullDocument.address.market': 'Sydney'
            }
        }
    ];

    await monitorUserChangeUsingEventEmitter(15000, pipeline)
}