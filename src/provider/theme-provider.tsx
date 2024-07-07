"use client"

import React from 'react'
import { ThemeProvider as ThemeProviderNext } from "next-themes";

interface Props {
    children: React.ReactNode
}

export default function ThemeProvider({ children }: Props) {
    return (
        <ThemeProviderNext
            enableSystem
            attribute="class"
            disableTransitionOnChange
        >
            {children}
        </ThemeProviderNext>
    )
}
