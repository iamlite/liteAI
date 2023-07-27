import { ipcRenderer } from 'electron';

const titlebarContext = {
  exit() {
    ipcRenderer.invoke('window-close');
  },
  minimize() {
    ipcRenderer.invoke('window-minimize');
  },
  toggle_maximize() {
    ipcRenderer.invoke('window-toggle-maximize');
  },
};

export type TitlebarContextApi = typeof titlebarContext;

export default titlebarContext;
