import App from "next/app"
import "../styles/settings/global.scss"

const MyApp = ({ Component, pageProps}) => {
      return <Component {...pageProps} />
}

export default MyApp