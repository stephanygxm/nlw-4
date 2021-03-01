// esse head é o head do html, tudo que colocarmos dentro dela o next.js vai colocar no head do html
import Head from 'next/head'
import { ChallengeBox } from '../components/ChallengeBox';
import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import { ChallengesProvider } from '../contexts/ChallengesContext';
import { CountdownProvider } from '../contexts/CountdownContext';

import { GetServerSideProps } from 'next';

import styles from '../styles/pages/Home.module.css'

// para não deixar a props como any, foi criada uma interface com os elementos que ela recebe da função getServerSideProps
// essas propriedades foram adicionadas também na interface ChallengesProviderProps para que ela passe a aceitá-las também e com isso colocar função ChallengesProvider (que está no contexto ChallengesContext)
interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

// o props foi colocado para acessar os cookies (da função getServerSideProps)
export default function Home(props: HomeProps) {
  return (
    // como foi trazido para ca o ChallengesProvider, dentro dele vou passar as informações de level, de currentExperience e de challengesCompleted
    <ChallengesProvider
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
    >
      <div className={styles.container}>
        {/* como o title é por página, não foi colocado no _document */}
        {/* o icon vai ser o mesmo em todas as páginas, por isso vai ser colocado no _document */}
        <Head>
          <title>Início | move.it</title>
        </Head>

        <ExperienceBar />

        {/* como esse contexto so vai ser utilizado no challengeBox, então não deve ser colocado no _app e sim aqui, por volta do elemento */}
        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>
            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  )
}

// função para recuperar os dados salvos nos cookies
// pode ser usado tanto function como const
// o nome dessa função precisa ser obrigatoriamente getServerSideProps e tem que ser assíncrona (async) pela tipagem do next
// obs: o console.log dado nessa função só é mostrado no terminal do node e não no console do browser, já que esse método é executado pelo servidor node e não no browser do usuário
// recebe um parãmetro chamado context (ctx)
// o tipo dessa função é GetServerSideProps que foi importado do next
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // dentro do contexto.requisição.cookies eu tenho todos os cookies da aplicação
  // dentro desses cookies eu quero o level, a currentExperience e o challengesCompleted
  const { level, currentExperience, challengesCompleted } = ctx.req.cookies;

  return {
    // como esses dados vem dos cookies como string, vamos converter de novo para number
    // pode converter para number usando o sinal + na frente, ex: level: +level
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted)
    }
  }
}