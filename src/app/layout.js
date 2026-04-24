import "./globals.css";

export const metadata = {
  title: "منصة الهندسة القيمية - EXPRO",
  description: "منصة توليد تقارير الهندسة القيمية وفق معايير EXPRO",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
