import { contextBridge, ipcRenderer } from 'electron';
import titlebarContext from './titlebarContext';

const ElectronHandler = {
  ipcRenderer: {
    store: {
      get(key: string) {
        return ipcRenderer.sendSync('electron-store-get', key);
      },
      set(key: string, val: unknown) {
        ipcRenderer.send('electron-store-set', key, val);
      },
      delete(key: string) {
        ipcRenderer.send('electron-store-delete', key);
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
