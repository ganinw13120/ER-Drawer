import React from 'react';
import './drawer.css';
import Drawer from './components/Drawer';
import DrawerStore, { DrawerStoreContext } from './stores/DrawerStore';

const drawerStore = new DrawerStore();

const Index : React.FC = () => {
  return (
    <>
      <div className='app'>
        <DrawerStoreContext.Provider value={drawerStore}>
            <Drawer />
        </DrawerStoreContext.Provider>
      </div>
    </>
  );
}

export default Index;
