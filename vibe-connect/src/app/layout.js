import "./globals.css";
import Providers from "../components/Providers";

export const metadata = {
  title: "VibeConnect",
  description: "Social platform based on shared vibes and AI matching",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-primary/30">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
