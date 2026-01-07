import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ModeToggle } from "@/components/theme-toggle-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="z-50 flex h-15 w-full items-center p-4 lg:sticky lg:top-0">
            <p>r/NUS</p>
            <div className="ml-auto">
              <ModeToggle />
            </div>
          </header>
          <div className="hidden h-15 lg:block"></div>
          <div>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
