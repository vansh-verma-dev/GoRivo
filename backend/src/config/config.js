require("dotenv").config();
const PORT = process.env.PORT || 9000 
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env file");
}

module.exports = {
    MONGO_URI , 
    PORT
}