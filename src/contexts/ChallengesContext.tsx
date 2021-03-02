import { createContext, ReactNode, useEffect, useState } from "react";
// importar os desafios json
import challenges from '../../challenges.json'
// importar os cookies para armazenar
import Cookies from 'js-cookie';
import { LevelUpModal } from "../components/LevelUpModal";

// esses são os 3 campos que tenho no json
interface Challenge {
    // o type é uma string, mas como so recebe dois valores, eu coloco os dois logo
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

// dados que vou retornar de dentro do meu contexto
interface ChallengesContextData {
    level: number;
    currentExperience: number;
    experienceToNextLevel: number;
    challengesCompleted: number;
    // é um obejeto, mas eu declarei os 3, então o tipo dele é Challenge
    activeChallenge: Challenge;
    // uma função que não tem retorno (ou seja, uma função que retorna void e não recebe nenhum parâmetro)
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

// para o children não ficar como any, vamos fazer um tipagem do children 
// o children é um componente react e quando o children de um componente também é um componente react, pode utilizar o ReactNode pois ele vai aceitar qualquer elemento filho como children
interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

// quando eu crio o meu contexto eu digo que o valor inicial dele é do tipo ChallengesContextData
// ele não tem o formato ChallengesContextData, por isso vem depois das {}, ele segue o contexto ChallengesContextData
export const ChallengesContext = createContext({} as ChallengesContextData);

// o children é do tipo ChallengesProviderProps que declarei em cima
// todas as propriedades que não são a children e veio dos cookies, vou utilizar um operador do js chamado rest operation
// o rest é um objeto que dentro dele tem o level, currentExperience e challengesCompleted
export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {

    // foi acrescentado ao valor inicial do level, currentExperience e challengesCompleted as propriedades que estão armazenando os valores nos cookies
    // ela diz que: se o rest.level não existir (que é justamente o valor armazenado) começar com 1 (mesma coisa para os outros dois - ex: rest.level ?? 1)
    // a condição que foi citada acima foi tirada para resolver o bug de inicialização e ficou so o rest. e a variável
    // essa condição foi colocada dentro do método getServerSideProps no index.tsx, pois o getServerSideProps roda antes de carregar a página e o Next tenta entregar a pagina pronta, como é a primeira vez, não existe os cookies, então eles ficam: level = NaN e currentExperience = NaN, ai ele vai pra experience bar e tenta carregar aquele componente, usando width = NaN% (por isso, assim que inciava a aplicação (sem cookie salvo),a barra verde ficava toda preenchida e só depois de dar f5 ela normalizava)
    const [level, setLevel] = useState(rest.level);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted);

    // estado para armazenar o challenge, que vai iniciar como nulo
    const [activeChallenge, setActiveChallenge] = useState(null);

    // calcular a experiencia que o usuario precisa para o proximo level baseada no level que ele está atualmente
    // esse é um calculo que os rpg usam para calculo de level
    // o 4 é o fator que diz o quão rápido eu vou passar ára o próximo nível (eu posso aumentar, dai dificultando a passada de nível, ou diminuir)
    // o math.pow é uama potência, antes da vírgula é a base, depois é o expoente
    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    // abrir o modal quando upar de level
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    // para mandar uma notificação quando um novo desafio estiver liberado, primeiro preciso pedir permissão ao usuário
    // utilizando o hook useEffect, que é quando eu só executo uma função quando algo acontecer, se eu passar o array vazio ele executa a função uma única vez quando esse componente for exebido em tela
    // Notification é a API do próprio browser
    useEffect(() => {
        Notification.requestPermission();
    }, [])

    // função para armazenar dados no cookies 
    // quero disparar a função sempre um ou algumas informações mudarem (sempre que o level, a experiência e o n° de desafios feitos mudarem, pois são essas variáveis que quero armazenar)
    // o Cookie.set armazena os dados
    // teve que colocar o String antes doa variáveis, pq elas são number e os cookies so aceitam string 
    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    function levelUp() {
        setLevel(level + 1);
        // quando ele upar de level eu troco para true
        setIsLevelUpModalOpen(true);
    }

    // função para fechar o modal
    function closeLevelUpModal() {
        // voltar para false 
        setIsLevelUpModalOpen(false);
    }

    // quando o countdown chegar a zero eu quero que despare um novo desafio (essa função está ligada no component Countdown)
    // primeiro eu quero pegar um desafio aleatório e o Math.radom retorna um número aleatório entre 0 e 1, logo se eu quiser que ele retorne um número entre 0 e alguma coisa, eu preciso passar o que seria esse alguma coisa multiplicando por ele, logo eu peguei o número de challenges que tenho no arquivo json
    // como ele retorna números quebrados também, tem que dar o math.floor para ele arredondar para baixo
    // a constante challeng armazena o desafio que foi escolhido aleatoriamente
    // irei fazer um if para se o usuário deu permissão para eu enviar notificações para ele, eu vou dar um new notification com as informações
    // e irei colococar o Audio que é um API nativa do browser
    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];
        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio 🎉', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    // função do botão falhei
    // quando clicado no botão, o setActivChallenge fica nulo, e ele executa o else da função que está no component ChallengeBox (o quadro muda para "finalize um ciclo...")
    function resetChallenge() {
        setActiveChallenge(null);
    }

    // função do botão completei
    // se eu não tiver com o um challenge ativo, vou dar um return void (vazio) (essa função é só uma validação para caso ele não tiver um challenge ativo, não vai ser chamado a função completeChallenge)
    function completeChallenge() {
        if (!activeChallenge) {
            return;
        }
        // vou buscar no activeChallenge o quanto de experiência que o desafio dá
        const { amount } = activeChallenge;
        // criar uma variável let do total de experiência que o usuário vai ficar (usou let por que é uma variável que o valor vai mudar depois)
        // vou pegar a experência de usuárioa atual e adicionar o tanto de experiência que esse desafio da
        let finalExperience = currentExperience + amount;
        // agora vou fazer com que as expiências que sobraram do nível anterior, ir para o próximo nível (ex: se o total de expiência que o usuário tem agora é 50 e o total que ele precisa é de 120, e o desafio que ele terminou deu 80 de xp, e 80 + 80 é 160, logo ele vai passar de nível, e ficar com 160 - 120 = 40xp)
        // se o finalExperience for maior ou igual a experienceToNextLevel eu vou upar o usuário de nivel chamando a função levelUp e vou falar que a experiencia final do usuário é igual a finalExperience - experienceToNextLevel
        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }
        setCurrentExperience(finalExperience);
        // pois quando ele finalizar o desafio, eu preciso zerar aquele desafio (não pode voltar mais a existir)
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider
            value={{
                level,
                currentExperience,
                experienceToNextLevel,
                challengesCompleted,
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                completeChallenge,
                closeLevelUpModal
            }}
        >
            {children}

            {/* eu posso dizer que todo lugar que eu tiver o ChallengesProvider eu vou ter o modal de level up, por que é o ChallengesProvider que vai abrir esse modal */}
            {/* forma de ter um if sem o else - se isLevelUpModalOpen mostar o modal */}
            { isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    );
}