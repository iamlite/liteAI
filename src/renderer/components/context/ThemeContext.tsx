import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

export type Theme = 'light' | 'dark';

export type ThemeName =
  | 'light'
  | 'dark'
  | 'retro'
  | 'cyberpunk'
  | 'dracula'
  | 'cupcake'
  | 'cmyk'
  | 'daisyui'
  | 'bumblebee'
  | 'emerald'
  | 'corporate'
  | 'synthwave'
  | 'valentine'
  | 'halloween'
  | 'garden'
  | 'forest'
  | 'aqua'
  | 'lofi'
  | 'pastel'
  | 'fantasy'
  | 'wireframe'
  | 'black'
  | 'luxury'
  | 'autumn'
  | 'business'
  | 'acid'
  | 'lemonade'
  | 'night'
  | 'coffee'
  | 'winter'
  | 'vibe'
  | 'darklite'
  | 'litelight';

export const themeNames: Record<Theme, ThemeName[]> = {
  light: [
    'litelight',
    'light',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'retro',
    'cyberpunk',
    'valentine',
    'garden',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'cmyk',
    'autumn',
    'acid',
    'lemonade',
    'winter',
    'vibe',
  ],
  dark: [
    'darklite',
    'dark',
    'dracula',
    'synthwave',
    'halloween',
    'forest',
    'black',
    'luxury',
    'business',
    'night',
    'coffee',
  ],
};

export type ThemeContextType = {
  theme: Theme;
  themeName: ThemeName;
  preferredLightThemeName: ThemeName;
  preferredDarkThemeName: ThemeName;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  setPreferredLightThemeName: React.Dispatch<React.SetStateAction<ThemeName>>;
  setPreferredDarkThemeName: React.Dispatch<React.SetStateAction<ThemeName>>;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const defaultLightTheme: ThemeName = 'litelight';
export const defaultDarkTheme: ThemeName = 'darklite';

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const ThemeProvider = React.memo(
  function ThemeProvider({ children }: { children: React.ReactNode }) {
    const prefersDarkMode = useMemo(
      () => window.matchMedia('(prefers-color-scheme: dark)').matches,
      []
    );

    const [theme, setTheme] = useState<Theme>(
      prefersDarkMode ? 'dark' : 'light'
    );

    const [preferredLightThemeName, setPreferredLightThemeName] =
      useState<ThemeName>(defaultLightTheme);
    const [preferredDarkThemeName, setPreferredDarkThemeName] =
      useState<ThemeName>(defaultDarkTheme);

    useEffect(() => {
      const storedLightThemeName =
        window.electron.ipcRenderer.store.get('lightMode');
      const storedDarkThemeName =
        window.electron.ipcRenderer.store.get('darkMode');

      if (
        storedLightThemeName &&
        themeNames.light.includes(storedLightThemeName as ThemeName)
      ) {
        setPreferredLightThemeName(storedLightThemeName as ThemeName);
      }
      if (
        storedDarkThemeName &&
        themeNames.dark.includes(storedDarkThemeName as ThemeName)
      ) {
        setPreferredDarkThemeName(storedDarkThemeName as ThemeName);
      }
    }, []);

    useEffect(() => {
      window.electron.ipcRenderer.store.set(
        'lightMode',
        preferredLightThemeName
      );
    }, [preferredLightThemeName]);

    useEffect(() => {
      window.electron.ipcRenderer.store.set('darkMode', preferredDarkThemeName);
    }, [preferredDarkThemeName]);

    const toggleTheme = useCallback(() => {
      setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
    }, []);

    const themeName =
      theme === 'light' ? preferredLightThemeName : preferredDarkThemeName;

    useEffect(() => {
      document.documentElement.setAttribute('data-theme', themeName);
    }, [themeName]);

    const contextValue = useMemo(
      () => ({
        theme,
        themeName,
        preferredLightThemeName,
        preferredDarkThemeName,
        setTheme,
        setPreferredLightThemeName,
        setPreferredDarkThemeName,
        toggleTheme,
      }),
      [
        theme,
        themeName,
        preferredLightThemeName,
        preferredDarkThemeName,
        toggleTheme,
      ]
    );

    return (
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    );
  }
);
