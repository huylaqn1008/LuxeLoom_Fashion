import { getCollections } from '@/lib/actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Collections = async () => {
    const collections = await getCollections()

    return (
        <div className='flex flex-col items-center gap-10 py-8 px-5'>
            <p className='text-heading1-bold'>Collections</p>
            {!collections || collections.length === 0 ? (
                <p className='text-body-bold'>No Collections Found</p>
            ) : (
                <div className='flex items-center justify-center gap-8'>
                    {collections.map((collection: CollectionType) => (
                        <Link href={`/collections/${collection._id}`} key={collection._id}>
                            <div className='w-[300px] h-[200px]'>
                                <Image
                                    src={collection.image}
                                    alt={collection.title}
                                    key={collection._id}
                                    width={300}
                                    height={200}
                                    className='rounded-lg cursor-pointer object-fill w-full h-full'
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Collections
