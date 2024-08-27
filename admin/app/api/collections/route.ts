import Collection from "@/lib/models/Collections"
import { connectDB } from "@/lib/mongoDB"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        await connectDB()

        const { title, description, image } = await req.json()

        const existingCollection = await Collection.findOne({ title })

        if (existingCollection) {
            return new NextResponse("Collection Already Exists", { status: 400 })
        }

        if (!title || !image) {
            return new NextResponse("Title And Image Are Required", { status: 400 })
        }

        const newCollection = await Collection.create({
            title,
            description,
            image
        })

        await newCollection.save()

        return NextResponse.json(newCollection, { status: 200 })
    } catch (error) {
        console.log("[collections_POST]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const GET = async (req: NextRequest) => {
    try {
        await connectDB()

        const collections = await Collection.find().sort({ createdAt: "desc" })

        return NextResponse.json(collections, { status: 200 })
    } catch (error) {
        console.log("[collections_GET]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}