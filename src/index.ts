import Express from 'express';

import initDB from '@/config/db';
import { routes } from '@/config/routes';
import startLogger from '@/config/logger';
import { startSDK } from '@/config/tracing'

const PORT = Bun.env.PORT || 3000;
const app = Express();

startLogger()
startSDK()
initDB()
routes(app)

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// main().catch(error => console.error("===MAIN=== ", error))

export default server