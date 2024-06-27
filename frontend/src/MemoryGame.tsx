import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import './globals.css'



  interface Card {
    id: number;
    image: string;
    flipped: boolean;
  }

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [playerTurn, setPlayerTurn] = useState(1)

  useEffect(() => {
    fetch('/api/initialize')
      .then(response => response.json())
      .then(data => {
        if (data.cards) {
          setCards(data.cards.map((image: string, index: number) => ({ id: index, image, flipped: false })));
        } else {
          console.error('Cards data is missing or in an unexpected format:', data);
        }
      })
  }, []);

  const handleCardClick = (id: number) => {
    fetch('/api/turn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ player_id: playerTurn, card_id: id })
    })
    .then(response => response.json())
    .then(data => {
      setPlayerTurn(data.current_turn)
      // Update local state with new scores
    });

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, flipped: !card.flipped } : card
      )
    );
  }

  return (
    <div className="memory-game">
      <h1 className="game-title">Memory Game</h1>
      <div className="game-info">
        <span className={`score ${playerTurn === 1 ? 'player-turn' : ''}`}>Player 1 Score: 0</span>
        <span className={`score ${playerTurn === 2 ? 'player-turn' : ''}`}>Player 2 Score: 0</span>
      </div>
      <button className="new-game-button">
        <Shuffle className="shuffle-icon" /> New Game
      </button>
      <div className='card-grid cols-4'>
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card card-size-medium ${card.flipped ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">
                <div className="card-content">?</div>
              </div>
              <div className="card-back">
                <div className="card-content">{card.image}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
