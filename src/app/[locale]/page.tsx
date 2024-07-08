"use client"

import { useTheme } from "next-themes";

export default function Page() {

  const { theme, setTheme } = useTheme();

  return (
    <main className="bg-white dark:bg-black h-screen">
      <div className={`text-4xl sm:text-6xl md:text-9xl text-center text-primary`}>MODE</div>
      <div>
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
    </main>
  );
}


