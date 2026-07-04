import type { ReactNode } from "react";

export default function SessionMenu({ children }: { children: ReactNode }) {
    return (
        <div className="w-full border-b! h-8 px-2 py-3 flex items-center justify-between">
            {children}
        </div>
    )
}