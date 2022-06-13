import '../styles/globals.css'
import { appWithTranslation } from 'next-i18next';
import { CookiesProvider } from "react-cookie"
function MyApp({ Component, pageProps }) {
  
  return(
  <CookiesProvider>
    <Component {...pageProps} />
  </CookiesProvider>
  )
}

export default appWithTranslation(MyApp);
