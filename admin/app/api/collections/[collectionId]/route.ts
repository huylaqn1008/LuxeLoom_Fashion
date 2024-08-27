import Collection from "@/lib/models/Collections"
import Product from "@/lib/models/Products"
import { connectDB } from "@/lib/mongoDB"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        await connectDB()

        const collection = await Collection.findById(params.collectionId)

        if (!collection) {
            return new NextResponse(JSON.stringify({ message: "Collection not found" }), { status: 404 })
        }

        return NextResponse.json(collection, { status: 200 })
    } catch (error) {
        console.error("[collectionId_GET]", error)
        return new NextResponse(JSON.stringify({ message: "Internal server error" }), { status: 500 })
    }
}

export const POST = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await connectDB()

        let collection = await Collection.findById(params.collectionId)

        if (!collection) {
            return new NextResponse("Collecion not found", { status: 404 })
        }

        const { title, description, image } = await req.json()

        if (!title || !image) {
            return new NextResponse("Title and image are required", { status: 400 })
        }

        collection = await Collection.findByIdAndUpdate(
            params.collectionId,
            { title, description, image },
            { new: true }
        )

        await collection.save()

        return NextResponse.json(collection, { status: 200 })
    } catch (error) {
        console.log(["collectionId_POST"], error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unthorized", { status: 401 })
        }

        await connectDB()

        await Collection.findByIdAndDelete(params.collectionId)

        await Product.updateMany(
            { collerions: params.collectionId },
            { $pull: { collections: params.collectionId } }
        )

        return new NextResponse("Collection is deleted", { status: 200 })
    } catch (error) {
        console.log("[collectionId_DELETE]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}