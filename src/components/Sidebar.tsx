"use client";
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
    const pathname = usePathname();
  return (
    <section className='sticky top-0 left-0 flex h-screen w-fit flex-col justify-between bg-zinc-900 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]'>
        <div className="flex flex-1 flex-col gap-6">
            {
                sidebarLinks.map((link) => {
                    // const isActive = (() => {
                    //     // Exact match for home route
                    //     if (link.route === "/") {
                    //         return pathname === "/";
                    //     }
                        
                    //     // For other routes, check if current path starts with the link route
                    //     // This handles nested routes like /personal-room, /upcoming, etc.
                    //     return pathname === link.route || pathname.startsWith(link.route + "/");
                    // })();

                    const isActive = pathname === link.route || pathname.startsWith(link.route + "/");

                    return (
                        <Link href={link.route} key={link.label} className={cn("flex gap-4 items-center p-4 justify-start rounded-lg", {'bg-blue-500': isActive})}>
                            <Image 
                            src={link.imgUrl}
                            alt={link.label}
                            width={24}
                            height={24}
                            />
                            <p className='text-lg font-semibold max-lg:hidden'>
                                {link.label}
                            </p>
                        </Link>
                    )
                })
            }
        </div>
    </section>
  )
}

export default Sidebar