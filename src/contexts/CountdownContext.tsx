import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

// dados que vou retornar de dentro desse contexto
interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData)

// criei essa variável só para saber o formato do countdownTimeout
let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownProviderProps) {
    // constante que tras o contexto que foi criado para ter a comunicação entre os componentes
    // essa função startNewChallenge é para ser ativada quando o contdown chegar em 0
    const { startNewChallenge } = useContext(ChallengesContext);

    // como o tempo vai regredindo em segundos, o useState tem que ser em segundos, então vai ser 25min*60seg
    // o setTime é a função para caso eu precise alterar o valor do time que é 1500seg
    const [time, setTime] = useState(25 * 60);
    // estado que armazena se o countdown está ativo ou não (se está acontecendo ou se está pausado/parado que é como ele inicia (em false))
    const [isActive, setIsActive] = useState(false);
    // ele vai iniciar como false por que no início ele não vai finalizado
    const [hasFinished, setHasFinished] = useState(false);

    // como estou querendo os minutos, eu divido o time (seg) por 60seg, e uso o Math.floor que arrendonda o numero para baixo, caso o valor dessa divisão dê 23,4 ele vai retornar só os minutos, que é 23
    const minutes = Math.floor(time / 60);
    // os segundos, no caso, é o resto da divisão
    const seconds = time % 60;

    // o setIsActive foi mudado para true, pois está função quando clicada o countdown começa a funcionar
    function startCountdown() {
        setIsActive(true)
    }

    // essa função vai parar de executar a função do setTimeout por que na verificação do if ele vai ver que o isActive está falso
    // quando eu resetar o countdown eu vou dar um clearTimeout passando a variável countdownTimeout que está antes da função setTimeout para que ele para no minuto certo, sem o delay de 1seg (1000)
    // e os minutos vão voltar para 25min 
    function resetCountdown() {
        clearTimeout(countdownTimeout);
        setIsActive(false);
        // para voltar para o estado inicial (com o botão de iniciar ciclo e o valor do countdown)
        setHasFinished(false);
        setTime(25 * 60);
    }

    // o useEffect recebe dois parâmetros, o primeiro parâmetro é o que eu quero executar e sempre vai ser uma função, o segundo parâmetro é quando eu quero executar a função, e é chamado de array de dependências
    // eu quero executar a função sempre que o valor de isActive e o time mudar
    // na função diz: se eu estou com countdown ativo (true) e o time é maior que 0, faça um setTimeout, ou seja, eu quero que algo aconteça depois de um tempo (poderia também ser utilizado o setInterval, mas ele é mais complicado para controlar o cancelamento dele (de quando o tempo acaba ou quando clica para pausar))
    // vou executar a função setTime depois de 1seg (1000) (na verdade, já executou, mas tem o delay de 1seg(1000) para ela funcionar), a função vai reduzir o time em 1seg 
    // como a função já executa mas com o delay de 1 seg (1000), então mesmo que o isActive vire falso, o setTime já tinha sido executado antes, então quando eu clicar no botão abandonar ciclo ele vai diminuir um segundo para assim parar
    // para isso eu estou passando uma variável countdownTimeout para que essa função não execute quando eu clicar no botão abandonar ciclo e assim parar no tempo certo
    useEffect(() => {
        if (isActive && time > 0) {
            countdownTimeout = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
            // se o countdown ainda esiver ativo e o time chegou a 0 vou dizer que ele finalizou e vou dar um setIsActive como false, pois ele não vai estar mais ativo (este segundo não vai ter impacto visual só é uma forma de manter os estados no valor que ele está)
        } else if (isActive && time == 0) {
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
        // console.log(isActive)
    }, [isActive, time])

    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown
        }}>
            {children}
        </CountdownContext.Provider>
    )
}