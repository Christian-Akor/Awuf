import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#0B0B0F" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="/sw-register.js" />
      </body>
    </Html>
  );
}
