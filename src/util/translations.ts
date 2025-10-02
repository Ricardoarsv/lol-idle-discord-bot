/**
 * Sistema de traducciones del bot para soporte multiidioma
 */

import type { LanguageCodes } from './enums';

export interface TranslationVariables {
  [key: string]: string | number;
}


const TRANSLATIONS = {
  es: {
    
    game: {
      title: '🎮 ¡Adivina el Campeón!',
      gameStarted: '🎮 **¡Nueva partida iniciada!**',
      championSelected: '🎯 He seleccionado un campeón secreto para que adivines.',
      howToGuess: '💭 Usa `/guess <nombre>` para intentar adivinar.',
      howToHint: '💡 Usa `/hint` para obtener pistas.',
      howToGiveup: '🏳️ Usa `/giveup` si quieres rendirte.',
      dailyMode: '📅 **Modo diario activo** - El mismo campeón para todos hoy.',
      goodLuck: '🍀 ¡Buena suerte!',
      
      start: {
        description: '¡Adivina el campeón misterioso!\n\nDificultad: **{{difficulty}}**\nUsa `/guess <nombre>` para adivinar o `/hint` para obtener pistas.',
        message: '🎮 **¡Nueva partida iniciada!**\n¡Adivina el campeón secreto! Usa `/guess <nombre>` para intentar.'
      },
      
      champion: {
        name: '🏆 Campeón',
        mystery: '❓ Campeón Misterioso',
        role: 'Rol',
        resource: 'Recurso'
      },
      
      attempts: {
        remaining: '🎯 Intentos Restantes'
      },
      
      difficulty: {
        name: '⚡ Dificultad'
      },
      
      footer: {
        guess: 'Usa /guess <nombre> para adivinar • /hint para pistas'
      },
      
      hint: {
        title: '💡 Pista',
        auto: '🎁 Pista Automática',
        types: {
          role: 'Rol: {{role}}',
          resource: 'Recurso: {{resource}}',
          title: 'Título: {{title}}',
          range: 'Rango: {{range}}',
          difficulty: 'Dificultad: {{difficulty}}',
          firstLetter: 'Primera letra: {{letter}}',
          length: 'Longitud del nombre: {{length}} caracteres',
          partial: 'Parte del nombre: {{partial}}'
        },
        progress: {
          title: '📊 Progreso de Pistas',
          used: 'Pistas usadas: {{used}}/{{max}}'
        },
        final: {
          title: '🔥 ¡Todas las pistas reveladas!',
          description: '¡Ya tienes toda la información! ¿Puedes adivinarlo ahora?'
        },
        footer: 'Usa /guess <nombre> para adivinar'
      },
      
      win: {
        title: '🎉 ¡Correcto!',
        description: '¡Felicitaciones! Has adivinado **{{champion}}** correctamente en {{attempts}}/{{maxAttempts}} intentos.',
        footer: '¡Excelente trabajo!'
      },
      
      wrong: {
        title: '❌ Incorrecto',
        description: '**{{guess}}** no es correcto. Te quedan {{remaining}} intentos.'
      },
      
      over: {
        title: '💀 Juego Terminado',
        noAttempts: 'Se acabaron los intentos. El campeón era **{{champion}}**.'
      },
      
      guesses: {
        previous: '📝 Intentos Anteriores',
        none: 'Ninguno'
      },
      
      score: {
        title: '⭐ Puntuación',
        points: 'puntos'
      },
      
      time: {
        elapsed: '⏱️ Tiempo Transcurrido'
      },
      
      
      congratulations: '¡Felicitaciones! Has adivinado correctamente.',
      availableHints: 'Pistas disponibles',
      attemptsCount: 'Intentos realizados',
      onRightTrack: '¡Estás en el camino correcto!',
      
      
      hintNumber: 'Pista {{number}}',
      allHintsUsed: 'Ya has usado todas las pistas disponibles ({{maxHints}}).',
      useAvailableInfo: '¡Usa la información que tienes para adivinar!',
      giveupOption: 'O usa `/giveup` si necesitas ver la respuesta.',
      allHintsRevealed: 'Todas las pistas reveladas',
      hintsProgress: 'Progreso de pistas',
      muchInfoAvailable: '¡Ya tienes mucha información! ¿Puedes adivinarlo?',
      goodProgress: '¡Vas por buen camino! Usa estas pistas para adivinar.',
      
      
      answerWas: 'La respuesta era',
      basicInfo: 'Información Básica',
      statistics: 'Estadísticas',
      abilities: 'Habilidades',
      dailyChampion: 'Campeón del día',
      randomChampion: 'Campeón aleatorio',
      
      
      gameStatistics: 'Estadísticas de la partida',
      hintsUsed: 'Pistas usadas',
      timePlayed: 'Tiempo jugado',
      noAttempts: '¡No lo intentaste! La próxima vez dale una oportunidad.',
      fewAttempts: '¡Estuviste muy cerca! Pocos intentos pero necesitaste ayuda.',
      goodEffort: '¡Buen esfuerzo! Hiciste varios intentos.',
      persistence: '¡Persistencia admirable! Muchos intentos, sigue practicando.',
      tryAnother: '¿Quieres intentar con otro campeón? Usa `/start` para una nueva partida.'
    },
    
    
    champion: {
      role: 'Rol',
      resource: 'Recurso',
      type: 'Tipo',
      difficulty: 'Dificultad',
      attackRange: 'Rango de ataque',
      movementSpeed: 'Velocidad',
      passive: 'Pasiva',
      manaCost: 'Coste de maná'
    },
    
    
    roles: {
      Assassin: 'Asesino',
      Fighter: 'Luchador',
      Mage: 'Mago',
      Marksman: 'Tirador',
      Support: 'Apoyo',
      Tank: 'Tanque'
    },
    
    
    attackTypes: {
      melee: 'Cuerpo a cuerpo',
      ranged: 'A distancia'
    },
    
    
    difficulty: {
      easy: 'Fácil',
      normal: 'Normal',
      hard: 'Difícil',
      expert: 'Experto'
    },
    
    
    settings: {
      languageChanged: 'Idioma cambiado a español',
      difficultyChanged: 'Dificultad cambiada a {{difficulty}}',
      currentSettings: 'Configuración actual',
      defaultDifficulty: 'Dificultad por defecto',
      settingsUpdated: 'Configuración actualizada correctamente.',
      
      language: {
        title: '🌍 Idioma Cambiado',
        success: 'Idioma cambiado exitosamente a **{{language}}**',
        error: 'Error al cambiar el idioma. Por favor intenta de nuevo.'
      },
      
      difficulty: {
        title: '⚡ Dificultad Cambiada',
        success: 'Dificultad cambiada exitosamente a **{{difficulty}}**',
        error: 'Error al cambiar la dificultad. Por favor intenta de nuevo.',
        info: 'ℹ️ Información de Dificultad'
      },
      
      autohints: {
        title: '💡 Auto-pistas',
        enabled: 'Las pistas automáticas han sido **activadas**',
        disabled: 'Las pistas automáticas han sido **desactivadas**',
        error: 'Error al cambiar la configuración de auto-pistas.'
      },
      
      view: {
        title: '⚙️ Tu Configuración Actual',
        description: 'Aquí puedes ver y modificar tu configuración personal.',
        language: '🌍 Idioma'
      }
    },
    
    
    language: {
      es: 'Español',
      en: 'English'
    },
    
    
    error: {
      title: '❌ Error',
      generic: 'Ha ocurrido un error inesperado. Por favor intenta de nuevo.',
      noChampions: 'No se pudieron cargar los campeones. Verifica tu conexión a internet.'
    },
    
    
    validation: {
      noActiveGame: 'No hay ninguna partida activa en este canal.',
      useStartCommand: 'Usa `/start` para comenzar una nueva partida.',
      enterValidName: 'Por favor, ingresa un nombre válido de campeón (al menos 2 caracteres).',
      nameTooLong: 'El nombre es demasiado largo. Intenta con un nombre más corto.',
      guessError: 'Hubo un error al procesar tu intento.',
      championDataError: 'Problemas al obtener información del campeón. Intenta de nuevo.',
      hintError: 'Hubo un error al obtener la pista.',
      championLoadError: 'Problemas al cargar información del campeón.',
      giveupError: 'Hubo un error al mostrar la respuesta.',
      sessionCleared: 'La sesión ha sido limpiada, pero no se pudo mostrar la información completa.',
      gameStartError: 'Hubo un error al iniciar la partida.',
      tryAgain: 'Por favor, intenta de nuevo más tarde.',
      settingsError: 'Hubo un error al cambiar la configuración.'
    },
    
    
    championInfo: {
      unclassified: 'Sin clasificar'
    }
  },
  
  en: {
    
    game: {
      title: '🎮 Guess the Champion!',
      gameStarted: '🎮 **New game started!**',
      championSelected: '🎯 I have selected a secret champion for you to guess.',
      howToGuess: '💭 Use `/guess <name>` to try guessing.',
      howToHint: '💡 Use `/hint` to get clues.',
      howToGiveup: '🏳️ Use `/giveup` if you want to give up.',
      dailyMode: '📅 **Daily mode active** - Same champion for everyone today.',
      goodLuck: '🍀 Good luck!',
      
      start: {
        description: 'Guess the mysterious champion!\n\nDifficulty: **{{difficulty}}**\nUse `/guess <name>` to guess or `/hint` to get clues.',
        message: '🎮 **New game started!**\nGuess the secret champion! Use `/guess <name>` to try.'
      },
      
      champion: {
        name: '🏆 Champion',
        mystery: '❓ Mystery Champion',
        role: 'Role',
        resource: 'Resource'
      },
      
      attempts: {
        remaining: '🎯 Attempts Remaining'
      },
      
      difficulty: {
        name: '⚡ Difficulty'
      },
      
      footer: {
        guess: 'Use /guess <name> to guess • /hint for clues'
      },
      
      hint: {
        title: '💡 Hint',
        auto: '🎁 Auto Hint',
        types: {
          role: 'Role: {{role}}',
          resource: 'Resource: {{resource}}',
          title: 'Title: {{title}}',
          range: 'Range: {{range}}',
          difficulty: 'Difficulty: {{difficulty}}',
          firstLetter: 'First letter: {{letter}}',
          length: 'Name length: {{length}} characters',
          partial: 'Part of name: {{partial}}'
        },
        progress: {
          title: '📊 Hint Progress',
          used: 'Hints used: {{used}}/{{max}}'
        },
        final: {
          title: '🔥 All hints revealed!',
          description: 'You have all the information! Can you guess it now?'
        },
        footer: 'Use /guess <name> to guess'
      },
      
      win: {
        title: '🎉 Correct!',
        description: 'Congratulations! You guessed **{{champion}}** correctly in {{attempts}}/{{maxAttempts}} attempts.',
        footer: 'Excellent work!'
      },
      
      wrong: {
        title: '❌ Incorrect',
        description: '**{{guess}}** is not correct. You have {{remaining}} attempts left.'
      },
      
      over: {
        title: '💀 Game Over',
        noAttempts: 'No attempts left. The champion was **{{champion}}**.'
      },
      
      guesses: {
        previous: '📝 Previous Attempts',
        none: 'None'
      },
      
      score: {
        title: '⭐ Score',
        points: 'points'
      },
      
      time: {
        elapsed: '⏱️ Time Elapsed'
      },
      
      
      congratulations: 'Congratulations! You guessed correctly.',
      availableHints: 'Available hints',
      attemptsCount: 'Attempts made',
      onRightTrack: "You're on the right track!",
      
      
      hintNumber: 'Hint {{number}}',
      allHintsUsed: 'You have used all available hints ({{maxHints}}).',
      useAvailableInfo: 'Use the information you have to guess!',
      giveupOption: 'Or use `/giveup` if you need to see the answer.',
      allHintsRevealed: 'All revealed hints',
      hintsProgress: 'Hints progress',
      muchInfoAvailable: 'You already have a lot of information! Can you guess it?',
      goodProgress: "You're making good progress! Use these hints to guess.",
      
      
      answerWas: 'The answer was',
      basicInfo: 'Basic Information',
      statistics: 'Statistics',
      abilities: 'Abilities',
      dailyChampion: 'Daily champion',
      randomChampion: 'Random champion',
      
      
      gameStatistics: 'Game statistics',
      hintsUsed: 'Hints used',
      timePlayed: 'Time played',
      noAttempts: "You didn't try! Give it a chance next time.",
      fewAttempts: 'You were very close! Few attempts but needed help.',
      goodEffort: 'Good effort! You made several attempts.',
      persistence: 'Admirable persistence! Many attempts, keep practicing.',
      tryAnother: 'Want to try another champion? Use `/start` for a new game.'
    },
    
    
    champion: {
      role: 'Role',
      resource: 'Resource',
      type: 'Type',
      difficulty: 'Difficulty',
      attackRange: 'Attack range',
      movementSpeed: 'Movement speed',
      passive: 'Passive',
      manaCost: 'Mana cost'
    },
    
    
    roles: {
      Assassin: 'Assassin',
      Fighter: 'Fighter',
      Mage: 'Mage',
      Marksman: 'Marksman',
      Support: 'Support',
      Tank: 'Tank'
    },
    
    
    attackTypes: {
      melee: 'Melee',
      ranged: 'Ranged'
    },
    
    
    difficulty: {
      easy: 'Easy',
      normal: 'Normal',
      hard: 'Hard',
      expert: 'Expert'
    },
    
    
    settings: {
      languageChanged: 'Language changed to English',
      difficultyChanged: 'Difficulty changed to {{difficulty}}',
      currentSettings: 'Current settings',
      language: 'Language',
      defaultDifficulty: 'Default difficulty',
      settingsUpdated: 'Settings updated successfully.'
    },
    
    
    validation: {
      noActiveGame: 'There is no active game in this channel.',
      useStartCommand: 'Use `/start` to begin a new game.',
      enterValidName: 'Please enter a valid champion name (at least 2 characters).',
      nameTooLong: 'The name is too long. Try a shorter name.',
      guessError: 'There was an error processing your attempt.',
      championDataError: 'Problems getting champion information. Try again.',
      hintError: 'There was an error getting the hint.',
      championLoadError: 'Problems loading champion information.',
      giveupError: 'There was an error showing the answer.',
      sessionCleared: 'The session has been cleared, but complete information could not be displayed.',
      gameStartError: 'There was an error starting the game.',
      tryAgain: 'Please try again later.',
      settingsError: 'There was an error changing the settings.'
    },
    
    
    championInfo: {
      unclassified: 'Unclassified'
    }
  }
} as const;

/**
 * Obtiene una traducción para el idioma especificado
 * @param language - Código del idioma
 * @param key - Clave de la traducción (puede usar notación de punto)
 * @param variables - Variables a interpolar
 * @param fallback - Texto de fallback si no se encuentra la traducción
 * @returns Texto traducido
 */
export function getTranslation(
  language: LanguageCodes,
  key: string,
  variables: TranslationVariables = {},
  fallback?: string
): string {
  try {
    
    const supportedLanguage = language in TRANSLATIONS ? language : 'es';
    const languageTranslations = TRANSLATIONS[supportedLanguage as keyof typeof TRANSLATIONS];
    
    
    const keys = key.split('.');
    let value: any = languageTranslations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        
        if (supportedLanguage !== 'es') {
          return getTranslation('es', key, variables, fallback);
        }
        return fallback || key;
      }
    }
    
    
    if (typeof value !== 'string') {
      return fallback || key;
    }
    
    
    let result = value;
    for (const [varKey, varValue] of Object.entries(variables)) {
      const placeholder = `{{${varKey}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(varValue));
    }
    
    return result;
  } catch (error) {
    console.error('Error in getTranslation:', error);
    return fallback || key;
  }
}

/**
 * Obtiene el locale correspondiente a un código de idioma
 * @param language - Código del idioma
 * @returns Locale correspondiente
 */
export function getLocaleFromLanguage(language: LanguageCodes): string {
  const localeMap: Record<LanguageCodes, string> = {
    es: 'es_ES',
    en: 'en_US',
    mx: 'es_MX'
  };
  
  return localeMap[language] || 'es_ES';
}

/**
 * Verifica si un idioma es soportado
 * @param language - Código del idioma a verificar
 * @returns True si el idioma es soportado
 */
export function isSupportedLanguage(language: string): language is LanguageCodes {
  return language in TRANSLATIONS;
}

/**
 * Obtiene la lista de idiomas soportados
 * @returns Array con los códigos de idioma soportados
 */
export function getSupportedLanguages(): LanguageCodes[] {
  return Object.keys(TRANSLATIONS) as LanguageCodes[];
}

/**
 * Obtiene todas las traducciones para depuración
 * @returns Objeto completo de traducciones
 */
export function getAllTranslations() {
  return TRANSLATIONS;
}

export { TRANSLATIONS };


export { getTranslation as translate };