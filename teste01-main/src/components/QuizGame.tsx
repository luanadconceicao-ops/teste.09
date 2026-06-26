import React, { useState } from 'react';
import './Games.css';

type Props = {
  onBack: () => void;
};

const questions = [
  {
    id: 1,
    question: 'O que é mais importante em uma situação de risco?',
    options: ['Sair do local', 'Chamar ajuda', 'Proteger sua vida', 'Avisar aos amigos'],
    correct: 2,
  },
  {
    id: 2,
    question: 'Qual é o número da central de atendimento às mulheres?',
    options: ['190', '180', '100', '120'],
    correct: 1,
  },
  {
    id: 3,
    question: 'Como você se sente quando compartilha seus sentimentos?',
    options: ['Vulnerável', 'Apoiado(a)', 'Confiante', 'Todas as anteriores'],
    correct: 3,
  },
  {
    id: 4,
    question: 'Qual é a melhor forma de se proteger?',
    options: ['Isolar-se', 'Buscar apoio', 'Ignorar problemas', 'Tomar decisões sozinho'],
    correct: 1,
  },
];

export default function QuizGame({ onBack }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === questions[currentQuestion].correct) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const question = questions[currentQuestion];
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="game-container">
      <button type="button" className="back-button" onClick={onBack}>
        ← Voltar
      </button>
      <h2>Quiz da Floresta</h2>

      {!finished ? (
        <div className="quiz-panel">
          <p className="quiz-progress">
            Pergunta {currentQuestion + 1} de {questions.length}
          </p>
          <h3>{question.question}</h3>
          <div className="quiz-options">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                className="quiz-option"
                onClick={() => handleAnswer(idx)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="game-win">
          <h3>🎉 Quiz finalizado!</h3>
          <p>
            Você acertou {score} de {questions.length} perguntas
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{percentage}%</p>
          <button type="button" className="primary-button" onClick={() => window.location.reload()}>
            Jogar novamente
          </button>
        </div>
      )}
    </div>
  );
}
