import React from 'react'
import { Locale } from '@/i18config'
import useLanguage from '@/components/Language/use-language'


interface Props {
    children: React.ReactNode
    locale: Locale
}


export default function LanguageProvider({ children, locale }: Props) {

    const test = useLanguage({ locale })

    return (
        <>
            {/* {locale} */}
            {children}
        </>
    )
}
