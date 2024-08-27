"use client"

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { X } from 'lucide-react'
import { FormMessage } from "@/components/ui/form"

// Xác định tên màu hợp lệ
const VALID_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'white', 'black']

interface MultiTextProps {
    placeholder: string
    value: string[]
    onChange: (value: string) => void
    onRemove: (value: string) => void
    type?: 'colors' | 'others' // Thêm prop type để phân biệt
}

const MultiText: React.FC<MultiTextProps> = ({ placeholder, value, onChange, onRemove, type }) => {
    const [inputValue, setInputValue] = useState("")
    const [error, setError] = useState("")

    const addValue = (item: string) => {
        const lowerCaseItem = item.toLowerCase()

        if (type === 'colors') {
            if (VALID_COLORS.includes(lowerCaseItem)) {
                onChange(item)
                setInputValue("")
                setError("")
            } else {
                setError("Invalid color name. Please enter a basic color.")
            }
        } else {
            onChange(item)
            setInputValue("")
            setError("")
        }
    }

    return (
        <>
            <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault()
                        addValue(inputValue)
                    }
                }}
            />
            {error && (
                <FormMessage style={{ color: 'red' }}>{error}</FormMessage>
            )}

            <div className='flex gap-1 flex-wrap mt-4'>
                {value.map((item, index) => {
                    const color = item.toLowerCase()
                    const isWhite = color === 'white'
                    const isBlack = color === 'black'

                    return (
                        <Badge
                            key={index}
                            style={{
                                backgroundColor: type === 'colors'
                                    ? (isWhite ? 'white' : color === 'black' ? 'black' : color)
                                    : 'grey', // Màu nền mặc định cho các trường khác không phải 'colors'
                                color: type === 'colors'
                                    ? (isWhite ? 'black' : color === 'black' ? 'white' : 'white')
                                    : 'white', // Màu chữ mặc định cho các trường khác không phải 'colors'
                                border: '1px solid black'
                            }}
                        >
                            {item}
                            <button
                                className='ml-1 rounded-full outline-none hover:bg-red-2'
                                onClick={() => onRemove(item)}
                            >
                                <X className='h-3 w-3' />
                            </button>
                        </Badge>
                    )
                })}
            </div>
        </>
    )
}

export default MultiText