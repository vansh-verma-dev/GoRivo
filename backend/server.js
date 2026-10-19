
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { PORT } = require("./src/config/config");
 

const startServer = async () => {
    try {
    
        await connectDB();

        console.log("MongoDB Atlas connected successfully");

        app.listen(PORT, () => {
            console.log(`GoRivo server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("GoRivo startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
