'use client'

import { navLinks } from '@/lib/constants'
import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

function TopBar() {
    const [dropDownMenu, setDropDownMenu] = useState(false)

    const pathname = usePathname()

    return (
        <div className='sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-green-2 shadow-xl lg:hidden'>
            <Image src='/logo.png' alt='logo' width={150} height={70} />

            <div className='hidden md:flex flex-row gap-16 gap-x-8'>
                {navLinks.map((link) => (
                    <Link href={link.url} key={link.label} className={`flex gap-4 text-body-medium ${pathname === link.url ? "text-blue-1" : "text-grey-1"}`}>
                        <p>{link.label}</p>
                    </Link>
                ))}
            </div>

            <div className='flex gap-4 items-center'>
                <Menu className='cursor-pointer md:hidden hover:text-blue-400 rounded-full w-6 h-6 hover:bg-gray-200' onClick={() => setDropDownMenu(!dropDownMenu)} />
                <UserButton />
            </div>

            {/* Dropdown menu */}
            {dropDownMenu && (
                <div className='absolute top-16 right-0 bg-white shadow-xl rounded-lg flex flex-col gap-4 p-4 md:hidden'>
                    {navLinks.map((link) => (
                        <Link href={link.url} key={link.label} className='flex gap-4 text-body-medium'>
                            <p>{link.label}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TopBar
