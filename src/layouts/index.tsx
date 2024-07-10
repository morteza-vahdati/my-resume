import React from 'react'

interface Props {
    children: React.ReactNode
}

export default function LayoutMain({ children }: Props) {
    return (
        <>
            <body className="bg-background">
                <div className="bg-gradient-to-tl dark:from-fuchsia-800 from-fuchsia-300 to-transparent via-transparent absolute top-0 left-0 w-full h-full"></div>
                <div className="bg-gradient-to-br dark:from-cyan-800 from-cyan-300 to-transparent via-transparent absolute bottom-0 right-0 w-full h-full"></div>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="w-96 bg-card rounded-lg border-primary border-2 overflow-hidden shadow-lg transform">
                        {children}
                    </div>
                </div>
            </body>
        </>
    )
}


