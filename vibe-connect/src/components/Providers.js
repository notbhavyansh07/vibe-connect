"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { io } from "socket.io-client";

export function Providers({ children }) {
    useEffect(() => {
        // Form the first connection layer between the old frontend and the new backend!
        const socket = io("http://localhost:5000");

        socket.on("connect", () => {
            console.log("Successfully linked to Vibe-Backend! Socket ID:", socket.id);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <SessionProvider>{children}</SessionProvider>;
}

