import { FC } from 'react';
import './Header.scss';

type HeaderProps = {
  score: number;
  bestScore: number;
  boardSize: number;
  onStartNewGame: (size: number) => void;
  onRevertStateBack: () => void;
  onEnableWebCamGestures: React.Dispatch<boolean>;
  onResizeBoard: React.Dispatch<number>;
};

export const Header: FC<HeaderProps> = ({
  score,
  bestScore,
  boardSize,
  onStartNewGame,
  onRevertStateBack,
  onEnableWebCamGestures,
  onResizeBoard,
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
      <select
        name='size'
        id='size'
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          onResizeBoard(parseInt(e.target.value));
        }}
      >
        {[4, 5, 6].map((size) => (
          <option defaultChecked={boardSize === size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <header className='header'>
        <h1 className='title'>2048</h1>
        <div className='controls' style={{}}>
          <div className='score'>
            <h4 className='score-title'>Score</h4>
            {score}
          </div>
          <div className='score'>
            <h4 className='score-title'>Best</h4>
            {bestScore}
          </div>
        </div>
        <div className='controls'>
          <div className='game-button' onClick={() => onStartNewGame(boardSize)}>
            New game
          </div>
          <div className='game-button' onClick={onRevertStateBack}>
            One move back
          </div>
        </div>
      </header>
    </div>
  );
};
