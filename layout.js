import "./globals.css";

export const metadata = {
  title: "portal.ai — Freelancer Client Portal",
  description: "AI-powered client portal for freelancers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
