"use client"

import { useTheme } from "next-themes";

export default function Theme() {

    const { theme, setTheme } = useTheme();


    return (
        <div className="bg-card">
            <select value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="system">System</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
            </select>
        </div>
    )
}
