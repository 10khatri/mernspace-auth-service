import app from "./app";
import { Config } from "./config";
const startServer = () => {
    const PORT = Config.PORT || 3000;
    try {
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exit(1);
    }
};
startServer();
