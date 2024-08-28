"use client"

import { UserButton, useUser } from '@clerk/nextjs'
import { CircleUserIcon, Menu, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const NavBar = () => {
    const { user } = useUser()

    const [dropDownMenu, setDropDownMenu] = useState(false)

    return (
        <div className='sticky top-0 z-10 py-2 px-10 flex justify-between items-center bg-white'>
            <Link href="/">
                <Image src="/logo.png" alt="logo" width={150} height={70} />
            </Link>

            <div>
                <Link href="/">Home</Link>
            </div>

            <div className='flex gap-3 items-center relative'>
                <Link href="/cart" className='flex items-center gap-3 border rounded-lg px-2 py-1 hover:bg-black hover:text-white'>
                    <ShoppingCart />
                    <p className='text-base-bold'>Cart (0)</p>
                </Link>

                {user && <Menu className='cursor-pointer' onClick={() => setDropDownMenu(!dropDownMenu)} />}

                {user && dropDownMenu && (
                    <div className='absolute top-10 right-5 flex flex-col gap-2 p-3 rounded-lg border bg-white text-base-bold'>
                        <Link href='/wishlist' className='hover:text-red-1'>Wishist</Link>
                        <Link href='/orders' className='hover:text-red-1'>Orders</Link>
                    </div>
                )}

                {user ? (
                    <UserButton afterSignOutUrl='/sign-in' />
                ) : (
                    <Link href='/sign-in'>
                        <CircleUserIcon />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default NavBar