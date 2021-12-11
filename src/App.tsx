import React from 'react';
import './App.css';
import Drawer from './components/Drawer';

const App : React.FC = () => {
  return (
    <>
      <div className='app'>
        <Drawer lineWidth={2} strokeStyle='gray' lineCap='round'/>
      </div>
    </>
  );
}

export default App;
