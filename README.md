# LoL Guesser Discord Bot

Bot de Discord para adivinar campeones de League of Legends usando la API de Data Dragon.

## Características

- 🎮 Juego de adivinanzas de campeones
- 💡 Sistema de pistas (rol, recurso, rango, título, pasiva)
- 📅 Modo diario con campeón del día
- 🌍 Soporte para múltiples idiomas
- 🚀 Comandos slash de Discord

## Comandos

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

## Configuración de Discord

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
