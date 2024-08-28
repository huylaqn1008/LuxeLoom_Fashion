import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import NavBar from "@/components/NavBar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LuxeLoom Store",
  description: "LuxeLoom Store Fashion",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <NavBar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
