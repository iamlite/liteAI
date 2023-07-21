import { contextBridge, ipcRenderer } from 'electron';
import titlebarContext from './titlebarContext';

const ElectronHandler = {
  ipcRenderer: {
    store: {
      get(key: string) {
        return ipcRenderer.sendSync('electron-store-get', key);
      },
      set(property: string, val: unknown) {
        ipcRenderer.send('electron-store-set', property, val);
      },      
      // Other methods like has(), reset(), etc.
    },
  },
};

contextBridge.exposeInMainWorld('electron', ElectronHandler);

contextBridge.exposeInMainWorld('electron_window', {
  titlebar: titlebarContext,
});

export { ElectronHandler };
