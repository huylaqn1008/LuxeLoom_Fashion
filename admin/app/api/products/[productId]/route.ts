import Collection from "@/lib/models/Collections"
import Product from "@/lib/models/Products"
import { connectDB } from "@/lib/mongoDB"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        await connectDB()

        const product = await Product.findById(params.productId).populate({ path: "collections", model: Collection })

        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 })
        }

        return NextResponse.json(product, { status: 200 })
    } catch (error) {
        console.error("[productId_GET]", error)
        return new NextResponse(JSON.stringify({ message: "Internal server error" }), { status: 500 })
    }
}

export const POST = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unthorized", { status: 401 })
        }

        await connectDB()

        const product = await Product.findById(params.productId)

        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 })
        }

        const { title, description, media, price, expense, category, tags, collections, colors, sizes } = await req.json()

        if (!title || !description || !media || !category || !price || !expense) {
            return new NextResponse("Not enough data to create a new product", { status: 400 })
        }

        const addedCollections = collections.filter((collectionId: string) => !product.collections.includes(collectionId))

        const removedCollections = product.collections.filter((collectionId: string) => !collections.includes(collectionId))

        await Promise.all([
            ...addedCollections.map((collectionId: string) => Collection.findByIdAndUpdate(collectionId, {
                $push: { products: product._id }
            })),

            ...removedCollections.map((collectionId: string) => Collection.findByIdAndUpdate(collectionId, {
                $pull: { products: product._id }
            }))
        ])

        const updatedProduct = await Product.findByIdAndUpdate(product._id, {
            title,
            description,
            media,
            price,
            expense,
            category,
            tags,
            collections,
            colors,
            sizes
        }, { new: true }).populate({ path: "collections", model: Collection })

        await updatedProduct.save()

        return NextResponse.json(updatedProduct, { status: 200 })
    } catch (error) {
        console.log("[productId_POST]", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await connectDB()

        const product = await Product.findById(params.productId)

        if (!product) {
            return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 })
        }

        // Xóa sản phẩm
        await Product.findByIdAndDelete(product._id)

        // Cập nhật các collection để xóa sản phẩm khỏi trường `products`
        await Promise.all(
            product.collections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $pull: { products: product._id }
                })
            )
        )

        return new NextResponse("Product is deleted", { status: 200 })
    } catch (error) {
        console.log("[productId_DELETE]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
