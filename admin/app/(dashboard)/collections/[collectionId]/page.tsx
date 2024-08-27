"use client"

import React, { useEffect, useState } from 'react'
import Loader from '@/components/custom ui/Loader'
import CollectionForm from '@/components/collections/CollectionForm'

const CollectionDetails = ({ params }: { params: { collectionId: string } }) => {
    const [loading, setLoading] = useState(true)
    const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null)
    const [error, setError] = useState<string | null>(null)

    const getCollectionDetails = async () => {
        if (!params.collectionId) {
            setError("Invalid collection ID.")
            setLoading(false)
            return
        }

        try {
            const res = await fetch(`/api/collections/${params.collectionId}`, {
                method: "GET"
            })

            if (!res.ok) {
                throw new Error(`Failed to fetch collection: ${res.statusText}`)
            }

            const data = await res.json()
            setCollectionDetails(data)
        } catch (error) {
            console.log("[collectionId_GET]", error)
            setError("Failed to load collection details.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCollectionDetails()
    }, [params.collectionId])

    if (loading) return <Loader />
    if (error) return <p>{error}</p>

    return (
        <CollectionForm initialData={collectionDetails} />
    )
}

export default CollectionDetails
