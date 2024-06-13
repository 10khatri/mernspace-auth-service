import app from "./app";
import { Config } from "./config";
import logger from "./config/logger";
const startServer = () => {
    const PORT = Config.PORT || 3000;
    try {
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (e: unknown) {
        if (e instanceof Error) {
            logger.error(e.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};
startServer();
