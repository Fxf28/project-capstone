// pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                {/* Global metadata dan CDN Tailwind */}
                <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charSet="UTF-8" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
