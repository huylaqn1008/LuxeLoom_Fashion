import mongoose from "mongoose"

let isConnected: boolean = false

export const connectDB = async (): Promise<void> => {
    mongoose.set("strictQuery", true)

    if (isConnected) {
        console.log("Connected MongoDB")
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL || "", {
            dbName: "Lux_Admin"
        })

        isConnected = true
    } catch (err) {
        console.log(err)
    }
}