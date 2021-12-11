import React from 'react';
import './App.css';
import Drawer from './components/Drawer';

const App : React.FC = () => {
  return (
    <>
      <div className='app'>
        <Drawer lineWidth={10} strokeStyle='red' lineCap='round'/>
      </div>
    </>
  );
}

export default App;
