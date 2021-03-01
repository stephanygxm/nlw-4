import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/LevelUpModal.module.css'

// eu posso colocar esse LevelUpModal em qualquer lugar que tenho acesso ao ChallengesContext (como na Home, no própeio ChallengesContext...)
// esse modal vai ser disparado pela função levalUp 

export function LevelUpModal() {
    // importar o contexto
    const { level, closeLevelUpModal } = useContext(ChallengesContext)

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <header>{level}</header>

                <strong>Parabéns</strong>
                <p>Você alcançou um novo level.</p>

                <button type="button" onClick={closeLevelUpModal}>
                    <img src="/icons/close.svg" alt="Fechar modal" />
                </button>
            </div>
        </div>
    );
}