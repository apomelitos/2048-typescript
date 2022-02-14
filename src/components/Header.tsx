import { FC } from 'react';
import './Header.scss';

type HeaderProps = {
  score: number;
  onStartNewGame: () => void;
  onRevertStateBack: () => void;
};

export const Header: FC<HeaderProps> = ({ score, onStartNewGame, onRevertStateBack }): JSX.Element => {
  return (
    <div>
      <header className='header'>
        <div className='controls'>
          <h1>2048</h1>
          <div className='game-button' onClick={onStartNewGame}>
            New game
          </div>
        </div>
        <div className='controls' style={{ width: '50%' }}>
          <div className='score'>
            <h4 className='score-title'>Score</h4>
            {score}
          </div>
          <div className='score'>
            <h4 className='score-title'>Best</h4>
            {score}
          </div>
          <div className='game-button' onClick={onRevertStateBack}>
            One move back
          </div>
        </div>
      </header>
    </div>
  );
};
