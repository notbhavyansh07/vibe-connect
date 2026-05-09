"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export function Providers({ children }) {
    useEffect(() => {
        // Socket connection moved to conditional logic in page.js to prevent production errors
    }, []);

    return <SessionProvider>{children}</SessionProvider>;
}
