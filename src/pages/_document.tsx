import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="w-full h-full">
      <Head />
      <body className='bg-gray-200 w-full h-full'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
