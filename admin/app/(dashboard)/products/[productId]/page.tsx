"use client"

import React, { useEffect, useState } from 'react'
import Loader from '@/components/custom ui/Loader'
import ProductForm from '@/components/products/ProductForm'

const ProductDetails = ({ params }: { params: { productId: string } }) => {
    const [loading, setLoading] = useState(true)
    const [productDetails, setProductDetails] = useState<ProductType | null>(null)
    const [error, setError] = useState<string | null>(null)

    const getProductDetails = async () => {
        if (!params.productId) {
            setError("Invalid product ID.")
            setLoading(false)
            return
        }

        try {
            const res = await fetch(`/api/products/${params.productId}`, {
                method: "GET"
            })

            if (!res.ok) {
                throw new Error(`Failed to fetch product: ${res.statusText}`)
            }

            const data = await res.json()
            setProductDetails(data)
        } catch (error) {
            console.log("[productId_GET]", error)
            setError("Failed to load product details.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProductDetails()
    }, [params.productId])

    if (loading) return <Loader />
    if (error) return <p>{error}</p>

    return (
        <ProductForm initialData={productDetails} />
    )
}

export default ProductDetails
