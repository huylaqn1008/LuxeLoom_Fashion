'use client'

import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea'
import ImageUpload from '../custom ui/ImageUpload'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Delete from '../custom ui/Delete'
import MultiText from '../custom ui/MultiText'
import MultiSelect from '../custom ui/MultiSelect'
import Loader from '../custom ui/Loader'

const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    media: z.array(z.string()),
    category: z.string(),
    collections: z.array(z.string()),
    tags: z.array(z.string()),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    price: z.coerce.number().min(100000, { message: "Price must be at least 100,000 VND" }),
    expense: z.coerce.number().min(100000, { message: "The cost must be at least 100,000 VND" })
})

interface ProductFormProps {
    initialData?: ProductType | null
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [collections, setCollections] = useState<CollectionType[]>([])

    const getCollections = async () => {
        try {
            setLoading(true)

            const res = await fetch("/api/collections", {
                method: "GET"
            })

            const data = await res.json()

            setCollections(data)
            setLoading(false)
        } catch (error) {
            console.log("[collections_GET]", error)
            toast.error("Something went wrong! Please try again.")
        }
    }

    useEffect(() => {
        getCollections()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            collections: initialData.collections.map(
                (collection) => collection._id
            )
        } : {
            title: "",
            description: "",
            media: [],
            category: "",
            collections: [],
            tags: [],
            sizes: [],
            colors: [],
            price: 100000,
            expense: 100000,
        },
    })

    function formatCurrency(value: number) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value)
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Submitting values:", values) // In log dữ liệu trước khi gửi
        console.log("Current loading state:", loading) // Kiểm tra trạng thái loading

        try {
            setLoading(true); // Bắt đầu loading
            const url = initialData ? `/api/products/${initialData._id}` : "/api/products";
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(values)
            });

            if (res.ok) {
                toast.success(`Product ${initialData ? "updated" : "created"}`);
                window.location.href = "/products"; // Điều hướng trang mới
                router.push("/products");
            } else {
                toast.error("Failed to submit. Please try again.");
            }
        } catch (error) {
            console.error("[products_POST]", error);
            toast.error("Something went wrong! Please try again.");
        } finally {
            setLoading(false); // Dù thành công hay thất bại cũng phải tắt loading
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
        }
    }

    //Không cho nhập "-" và "."
    const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === '-' || e.key === '.') {
            e.preventDefault()  // Ngăn không cho nhập dấu trừ và dấu .
        }
    }

    //Nút tăng/giảm giá trị không giảm qua 0
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const value = Math.max(0, parseInt(e.target.value || '0', 10))
        field.onChange(value)
    }

    return loading ? <Loader /> : (
        <div className='p-10'>
            {initialData ? (
                <div className='flex items-center justify-between'>
                    <p className='text-heading2-bold'>Edit Product</p>
                    <Delete item="product" id={initialData._id} />
                </div>) : (
                <p className='text-heading2-bold'>Create Product</p>)}
            <Separator className='mt-4 mb-7 bg-grey-1' />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description" {...field} rows={5} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="media"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='mr-3'>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={(url) => field.onChange([...field.value, url])}
                                        onRemove={(url) => field.onChange([...field.value.filter((image => image !== url))])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='md:grid md:grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Price"
                                            step={10000} //Mỗi lần tăng/giảm 10.000
                                            value={field.value}
                                            onKeyDown={handlePriceKeyDown}  // Chặn nhập dấu trừ và dấu .
                                            onChange={(e) => handlePriceChange(e, field)}  // Chặn giảm giá trị qua 0
                                        />
                                    </FormControl>
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                    <p>{formatCurrency(field.value)}</p>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expense"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Expense</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Expense"

                                            value={field.value}
                                            onKeyDown={handlePriceKeyDown}  // Chặn nhập dấu trừ và dấu .
                                            onChange={(e) => handlePriceChange(e, field)}  // Chặn giảm giá trị qua 0
                                        />
                                    </FormControl>
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                    <p>{formatCurrency(field.value)}</p>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder="Tags"
                                            value={field.value}
                                            onChange={(tag) => field.onChange([...field.value, tag])}
                                            onRemove={(tagToRemove) => field.onChange([...field.value.filter((tag => tag !== tagToRemove))])}
                                            type='others'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {collections.length > 0 && (
                            <FormField
                                control={form.control}
                                name="collections"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Collections</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                placeholder="Collections"
                                                collections={collections}
                                                value={field.value}
                                                onChange={(_id) => field.onChange([...field.value, _id])}
                                                onRemove={(idToRemove) => field.onChange([...field.value.filter((collectionId => collectionId !== idToRemove))])}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="colors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Colors</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder="Colors"
                                            value={field.value}
                                            onChange={(color) => field.onChange([...field.value, color])}
                                            onRemove={(colorToRemove) => field.onChange([...field.value.filter((color => color !== colorToRemove))])}
                                            type='colors'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sizes</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder="Sizes"
                                            value={field.value}
                                            onChange={(size) => {
                                                const newValue = [...(field.value || []), size]
                                                console.log("Updated Sizes:", newValue) // Kiểm tra giá trị trước khi lưu
                                                field.onChange(newValue)
                                            }}

                                            onRemove={(sizeToRemove) => field.onChange([...field.value.filter((size => size !== sizeToRemove))])}
                                            type='others'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='flex gap-10'>
                        <Button type="submit" className='bg-blue-1 text-white' disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                        <Button type="button" onClick={() => router.push("/products")} className='bg-red-1 text-white'>
                            Discard
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ProductForm
