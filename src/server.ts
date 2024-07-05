import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";
const startServer = async () => {
    const PORT = Config.PORT || 3000;
    try {
        await AppDataSource.initialize();
        logger.info("Database connected");

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
void startServer();
