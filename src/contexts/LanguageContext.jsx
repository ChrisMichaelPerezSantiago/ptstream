
import React, { createContext, useContext, useState, useEffect } from "react";
import { Effect, pipe } from "effect";

const LanguageContext = createContext();

const getStoredLanguage = () =>
  pipe(
    Effect.sync(() => localStorage.getItem("appLang")),
    Effect.map((storedLang) => storedLang || "en"),
    Effect.runSync
  );

const setStoredLanguage = (lang) =>
  pipe(
    Effect.sync(() => lang),
    Effect.tap((currentLang) => 
      Effect.sync(() => localStorage.setItem("appLang", currentLang))
    ),
    Effect.runSync
  );

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => getStoredLanguage());
  
  useEffect(() => {
    pipe(
      Effect.sync(() => lang),
      Effect.tap((currentLang) => Effect.sync(() => setStoredLanguage(currentLang))),
      Effect.runSync
    );
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
