

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { StudentProvider } from "./context/StudentContext";
// Load Google Fonts with CSS variables
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Page metadata
export const metadata = {
    title: "Lumos Milestone Care",
    description: "A structured, secure, and organized platform for managing therapy session documentation.",
    icons: {
        icon: "/images/2ndLogo.jpg",
    },
};

// Root layout component
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <Head>
                <link rel="icon" href="/images/2ndLogo.jpg" type="image/jpg" />
            </Head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <StudentProvider>
                    {children}
                </StudentProvider>
            </body>
        </html>
    );
}
