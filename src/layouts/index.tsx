import Image from 'next/image'
import React from 'react'

interface Props {
    children: React.ReactNode
}

export default function LayoutMain({ children }: Props) {
    return (
        <main className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-background">
            <Image src="" alt="" className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2" width="1308" />
            <div className="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="relative px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
                {children}
            </div>
        </main>
    )
}


