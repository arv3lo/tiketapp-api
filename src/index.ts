import Express from 'express';

import initMongoDB from '@/config/mongodb';
import { routes } from '@/config/routes';

const PORT = Bun.env.PORT || 3000;
const app = Express();

initMongoDB()
routes(app)

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// main().catch(error => console.error("===MAIN=== ", error))

export default server