import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes"; 
import "../styles/globals.css";
import { AIChatWidget } from "@/components/ai/AIChatWidget"; // 👈 Thêm dòng này

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "ISU - I See U",
  description: "An application to xem bói toán",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning> 
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"    
          defaultTheme="system"         
          enableSystem
        >
          {children}

          <AIChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
