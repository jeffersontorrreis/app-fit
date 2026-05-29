import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VivaFit Admin',
  description: 'Painel administrativo VivaFit',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const saved = localStorage.getItem('vivafit-admin-theme');
              const mode = saved === 'light' || saved === 'dark'
                ? saved
                : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', mode);
            })();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
