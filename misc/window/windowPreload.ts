import { contextBridge, ipcRenderer } from 'electron';
import titlebarContext from './titlebarContext';

export const ElectronHandler = {
  ipcRenderer: {
    store: {
      get(key: string) {
        return ipcRenderer.sendSync('electron-store-get', key);
      },
      set(key: string, val: unknown) {
        ipcRenderer.send('electron-store-set', key, val);
      },
      clear() {
        ipcRenderer.send('electron-store-clear', );
      },
    },
  },
};

contextBridge.exposeInMainWorld('electron', ElectronHandler);

contextBridge.exposeInMainWorld('electron_window', {
  titlebar: titlebarContext,
});
