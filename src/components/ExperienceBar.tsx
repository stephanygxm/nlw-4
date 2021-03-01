import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/ExperienceBar.module.css'

export function ExperienceBar() {
    // importanto o contexto
    const { currentExperience, experienceToNextLevel } = useContext(ChallengesContext);

    // calcular o progresso da barrinha verde 
    // utilizei regra de três simples: se 64 (xp que quero chgar para upar o level 2: experienceToNextLevel) representa 100% o quanto que 0 (xp que começo: currentExperience) representa
    // utilizei o math.round para arredondar o valor (isso evita que o width da barrinha fique muito quebrado)
    const percentToNextLevel = Math.round(currentExperience * 100) / experienceToNextLevel;

    return (
        <header className={styles.experienceBar}>
            <span>0 xp</span>
            <div>
                <div style={{ width: `${percentToNextLevel}%` }}></div>
                <span className={styles.currentExperience} style={{ left: `${percentToNextLevel}%` }}>
                    {currentExperience} xp
                </span>
            </div>
            <span>{experienceToNextLevel} xp</span>
        </header>
    );
}