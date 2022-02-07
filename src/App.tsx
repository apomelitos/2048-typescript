import { FC } from 'react';
import { Game } from './components/Game';
import './App.scss';

export const App: FC = (): JSX.Element => {
  return (
    <div className='App'>
      <h1>2048</h1>
      <Game />
    </div>
  );
};

export default App;
