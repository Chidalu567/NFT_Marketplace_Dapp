import Link from 'next/link'
import '../styles/globals.css'
import Layout from '../UI_util_comp/layout'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Layout>
        <Component {...pageProps} />
      </Layout>

    </div>
  )
}

export default MyApp
