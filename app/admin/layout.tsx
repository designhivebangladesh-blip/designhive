import "../globals.css";

export const metadata = {
  title: "Designhive Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink font-sans text-parchment antialiased">
        {children}
      </body>
    </html>
  );
}
