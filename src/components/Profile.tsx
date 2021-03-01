import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css'

export function Profile() {
    // importar o contexto
    const { level } = useContext(ChallengesContext)

    return (
        <div className={styles.profileContainer}>
            <img src="https://github.com/stephanygxm.png" alt="Stephany Xavier"></img>
            <div>
                <strong>Stephany Xavier</strong>
                <p>
                    {/* como está na pasta public, não precisa colocar a sequência de pastas desde o início */}
                    <img src="icons/level.svg" alt="level"></img>
                    Level {level}
                </p>
            </div>
        </div>
    );
}