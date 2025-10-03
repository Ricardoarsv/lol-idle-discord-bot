# LoL Guesser Discord Bot

Bot de Discord para adivinar campeones de League of Legends usando la API de Data Dragon.

## 🎯 Características

- 🎮 Juego de adivinanzas de campeones
- 💡 Sistema de pistas (rol, recurso, rango, título, pasiva)
- 📅 Modo diario con campeón del día
- 🌍 Soporte para múltiples idiomas
- 🚀 Comandos slash de Discord
- 🏗️ Arquitectura limpia y escalable

## 🏗️ Arquitectura

Este proyecto utiliza **Clean Architecture** para mantener el código organizado, testeable y escalable.

### Estructura de carpetas

```
src/
├── domain/           # Lógica de negocio
├── infrastructure/   # Implementaciones concretas
├── presentation/     # Interfaz (Discord)
└── shared/          # Código compartido
```

📖 Ver documentación completa:
- [CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md) - Guía de arquitectura
- [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md) - Diagramas visuales
- [EXTENSION_GUIDE.md](EXTENSION_GUIDE.md) - Cómo extender el proyecto

## 📋 Comandos

- `/start` - Inicia una nueva partida
- `/start daily:true` - Inicia partida con campeón del día
- `/guess <nombre>` - Adivina el campeón
- `/hint` - Pide una pista adicional
- `/giveup` - Rendirse y ver la respuesta

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia `.env.example` a `.env` y configura las variables:
   ```
   DISCORD_TOKEN=tu_token_aqui
   DISCORD_APP_ID=tu_app_id_aqui
   DISCORD_GUILD_ID=tu_guild_id_aqui
   ```
4. Registra los comandos:
   ```bash
   npm run register
   ```
5. Inicia el bot:
   ```bash
   npm start
   ```

## 🚀 Inicio Rápido

### Desarrollo (con Clean Architecture)
```bash
npm run dev:clean
```

### Desarrollo (código original)
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run start
```

## 📚 Documentación Adicional

- **[CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md)** - Explicación de la arquitectura
- **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)** - Diagramas y flujos
- **[EXTENSION_GUIDE.md](EXTENSION_GUIDE.md)** - Guía para extender el proyecto
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - Resumen de la migración

## 🎓 Aprende Más

Este proyecto es un excelente ejemplo de:
- Clean Architecture en TypeScript
- Inyección de dependencias
- Principios SOLID
- Arquitectura por capas
- Discord.js con TypeScript

## 📄 Licencia

1. Ve a https://discord.com/developers/applications
2. Crea una nueva aplicación
3. Ve a "Bot" y crea un bot
4. Copia el token al archivo `.env`
5. Ve a "OAuth2 > URL Generator"
6. Selecciona scopes: `bot`, `applications.commands`
7. Selecciona permisos: `Send Messages`, `Use Slash Commands`, `Embed Links`
8. Usa la URL generada para invitar el bot a tu servidor

## Estructura del Proyecto

```
src/
├── index.js              # Punto de entrada del bot
├── register-commands.js  # Registro de comandos slash
├── commands/             # Comandos del bot
│   ├── start.js
│   ├── guess.js
│   ├── hint.js
│   └── giveup.js
├── game/                 # Lógica del juego
│   ├── engine.js
│   └── store.js
├── data/                 # Manejo de datos de LoL
│   ├── ddragon.js
│   └── normalize.js
└── util/                 # Utilidades
    └── constants.js
```

## API Utilizada

- **Data Dragon**: API oficial de Riot Games para datos estáticos
- **Community Dragon**: Assets adicionales (opcional)

## Licencia

MIT
