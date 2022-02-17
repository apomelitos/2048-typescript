import { FC } from 'react';
import './Header.scss';

type HeaderProps = {
  score: number;
  bestScore: number;
  onStartNewGame: () => void;
  onRevertStateBack: () => void;
  onEnableWebCamGestures: React.Dispatch<boolean>;
};

export const Header: FC<HeaderProps> = ({
  score,
  bestScore,
  onStartNewGame,
  onRevertStateBack,
  onEnableWebCamGestures,
}): JSX.Element => {
  return (
    <div>
      <label htmlFor='webCamGestures'>
        <input
          type='checkbox'
          name='webCamGestures'
          id='webCamGestures'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEnableWebCamGestures(e.target.checked)}
        />
        WebCam gestures
      </label>
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
            {bestScore}
          </div>
          <div className='game-button' onClick={onRevertStateBack}>
            One move back
          </div>
        </div>
      </header>
    </div>
  );
};
