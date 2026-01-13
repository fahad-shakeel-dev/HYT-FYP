import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const url = process.env.MONGODB_URI || process.env.MONOGO_DB_URL;
        if (!url) {
            console.warn("DB Connection String missing in environment.");
            return;
        }
        await mongoose.connect(url, {
            dbName: 'FinanceManagement',
        });
        console.log("DB Connected...");
    } catch (error) {
        console.log('Failed To Connect With DataBase')
        console.log(error)
    }
}
