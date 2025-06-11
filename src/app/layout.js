// app/layout.js (or layout.tsx)
import './globals.css';
import Navbar from '@/components/Navbar';
import ThemeProviders from '@/components/ThemeProviders';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <ThemeProviders>
          <Navbar/>
          {children}
        </ThemeProviders>
      </body>
    </html>
  );
}
