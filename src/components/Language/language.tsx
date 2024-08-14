import { Locale } from '@/i18config'
import React from 'react'

export default function Language({ locale }: { locale: Locale }) {

    return (
        <div className="bg-card">
            <select value={locale}>
                <option value="en">en</option>
                <option value="fa">fa</option>
            </select>
        </div>
    )
}
