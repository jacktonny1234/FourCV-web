import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FourCV - Computer Vision Solutions',
  description: 'Advanced computer vision solutions for businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <script src="/js/opencv.js" type="text/javascript"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}