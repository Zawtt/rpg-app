import React, { useState, useEffect, useRef } from 'react';

const diceLandSound = new Audio('/sounds/dice_land.mp3'); // Certifique-se de ter este arquivo!

function RollAnimationOverlay({ onAnimationEnd }) { // Remove targetRect, targetFontSize, result pois não são mais usados para animação de movimento
  const [animationPhase, setAnimationPhase] = useState('entering'); // 'entering', 'rolling', 'exiting'
  const [displayNumber, setDisplayNumber] = useState(''); // O número aleatório que será mostrado
  const intervalRef = useRef(null); // Para controlar o setInterval da rolagem

  useEffect(() => {
    // Fase 1: 'entering' - Overlay escurece e um número aleatório inicial aparece grande no centro.
    const initialRandomNum = Math.floor(Math.random() * 99) + 1; // Um número aleatório inicial, ex: 1 a 100
    setDisplayNumber(initialRandomNum);

    setAnimationPhase('entering');

    // Transição para a fase de rolagem rápida após um breve momento
    const startRollingTimeout = setTimeout(() => {
      setAnimationPhase('rolling');
    }, 300); // 300ms de exibição do número aleatório inicial grande

    return () => clearTimeout(startRollingTimeout);
  }, []); // [] para rodar uma vez ao montar, já que a animação não depende de 'result' diretamente agora

  useEffect(() => {
    if (animationPhase === 'rolling') {
      let rollCount = 0;
      const maxRolls = 25; // Aumentei para um efeito mais prolongado de rolagem
      const rollSpeed = 50; // Aumentei a velocidade para um efeito mais rápido

      intervalRef.current = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 999) + 1); // Números aleatórios genéricos para simular a rolagem
        rollCount++;

        if (rollCount >= maxRolls) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          // Após a rolagem rápida, transiciona para a fase 'exiting'
          setAnimationPhase('exiting');
          diceLandSound.play().catch(e => console.error("Erro ao tocar som de pouso:", e)); // Toca o som ao final da rolagem
        }
      }, rollSpeed);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [animationPhase]); // Depende apenas da fase da animação

  useEffect(() => {
    if (animationPhase === 'exiting') {
      // Fase 3: 'exiting' - O overlay escuro desaparece.
      const exitTransitionDuration = 500; // Duração da transição de opacidade do overlay

      const finalEndTimeout = setTimeout(() => {
        onAnimationEnd(); // Notifica o pai que a animação do overlay terminou
      }, exitTransitionDuration);

      return () => clearTimeout(finalEndTimeout);
    }
  }, [animationPhase, onAnimationEnd]);

  // Controla a opacidade do overlay principal e do número aleatório
  const overlayOpacity = animationPhase === 'exiting' ? 0 : 1;
  const numberOpacity = (animationPhase === 'entering' || animationPhase === 'rolling') ? 1 : 0; // Número visível apenas nessas fases

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[999] transition-opacity duration-500`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo preto semi-transparente
        opacity: overlayOpacity
      }}
    >
      <div
        className={`font-extrabold text-white leading-none select-none text-9xl transition-opacity duration-300`}
        style={{ opacity: numberOpacity }} // Controla a opacidade do número que aparece no centro
      >
        {displayNumber}
      </div>
    </div>
  );
}

export default RollAnimationOverlay;