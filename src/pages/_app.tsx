// tudo que for ser repetido em todas as páginas vai ser colocado nesta pasta _app
import '../styles/global.css'

// import { ChallengesProvider } from '../contexts/ChallengesContext'

function MyApp({ Component, pageProps }) {
  return (
    // o ChallengesProvider foi passado para o index por fora da aplicação, já que agora está utilizando cookies, as informações estão sendo salvas nos cookies
    // <ChallengesProvider>
    <Component {...pageProps} />
    // </ChallengesProvider>
  )
}

export default MyApp
