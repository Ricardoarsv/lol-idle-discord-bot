import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import startCommand from './commands/start';
import guessCommand from './commands/guess';
import hintCommand from './commands/hint';
import giveupCommand from './commands/giveup';
import settingsCommand from './commands/settings';
import type { BotCommand } from './types/index';


const requiredEnvVars = ['DISCORD_TOKEN', 'DISCORD_APP_ID'] as const;
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	console.error('❌ Variables de entorno faltantes:');
	missingVars.forEach((varName) => {
		console.error(`   - ${varName}`);
	});
	console.error('\n💡 Asegúrate de tener un archivo .env con las variables requeridas.');
	console.error('   Puedes usar .env.example como referencia.');
	process.exit(1);
}


function validateCommand(command: BotCommand): boolean {
	if (!command.data || !command.data.name) {
		console.error('❌ Comando inválido: falta data.name');
		return false;
	}
	if (!command.execute) {
		console.error(`❌ Comando ${command.data.name}: falta función execute`);
		return false;
	}
	return true;
}


const commandModules: BotCommand[] = [
	startCommand,
	guessCommand,
	hintCommand,
	giveupCommand,
	settingsCommand
];


const validCommands = commandModules.filter(validateCommand);

if (validCommands.length !== commandModules.length) {
	console.error('❌ Algunos comandos son inválidos. Abortando registro.');
	process.exit(1);
}


const commands = validCommands.map((command) => {
	console.log(`📝 Preparando comando: /${command.data.name}`);
	try {
		return command.data.toJSON();
	} catch (error) {
		console.error(`❌ Error convirtiendo comando ${command.data.name} a JSON:`, error);
		throw error;
	}
});


const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

async function registerCommands(): Promise<void> {
	try {
		console.log('🚀 Iniciando registro de comandos slash...');
		console.log(`📊 Total de comandos a registrar: ${commands.length}`);

		
		const guildId = process.env.DISCORD_GUILD_ID;
		let route: `/${string}`;
		let scope: string;

		if (guildId) {
			
			route = Routes.applicationGuildCommands(process.env.DISCORD_APP_ID!, guildId) as `/${string}`;
			scope = `servidor ${guildId}`;
		} else {
			
			route = Routes.applicationCommands(process.env.DISCORD_APP_ID!) as `/${string}`;
			scope = 'globalmente';
		}

		console.log(`📡 Registrando comandos ${scope}...`);

		const data = await rest.put(route, { body: commands }) as any[];

		console.log(`✅ ${data.length} comandos slash registrados exitosamente ${scope}.`);
		console.log('📋 Comandos registrados:');
		
		data.forEach((cmd: any) => {
			console.log(`   • /${cmd.name} - ${cmd.description}`);
			if (cmd.description_localizations) {
				Object.entries(cmd.description_localizations).forEach(([locale, desc]) => {
					console.log(`     [${locale}]: ${desc}`);
				});
			}
		});

		if (!guildId) {
			console.log('\n⏰ Nota: Los comandos globales pueden tardar hasta 1 hora en aparecer.');
			console.log('💡 Para pruebas rápidas, configura DISCORD_GUILD_ID en tu .env');
		}

		console.log('\n🎉 ¡Registro de comandos completado exitosamente!');
		console.log('🤖 El bot ahora puede usar estos comandos slash.');

	} catch (error) {
		console.error('❌ Error registrando comandos slash:', error);
		
		if (error instanceof Error) {
			
			if (error.message.includes('401')) {
				console.error('💡 Error 401: Verifica que DISCORD_TOKEN sea correcto');
			} else if (error.message.includes('403')) {
				console.error('💡 Error 403: El bot no tiene permisos en el servidor');
			} else if (error.message.includes('404')) {
				console.error('💡 Error 404: Verifica DISCORD_APP_ID y DISCORD_GUILD_ID');
			}
		}
		
		process.exit(1);
	}
}


async function clearCommands(): Promise<void> {
	try {
		console.log('🧹 Eliminando comandos existentes...');
		
		const guildId = process.env.DISCORD_GUILD_ID;
		let route: `/${string}`;

		if (guildId) {
			route = Routes.applicationGuildCommands(process.env.DISCORD_APP_ID!, guildId) as `/${string}`;
		} else {
			route = Routes.applicationCommands(process.env.DISCORD_APP_ID!) as `/${string}`;
		}

		const data = await rest.put(route, { body: [] }) as any[];
		console.log(`✅ ${data.length} comandos eliminados.`);

	} catch (error) {
		console.error('❌ Error eliminando comandos:', error);
		throw error;
	}
}


const args = process.argv.slice(2);

if (args.includes('--clear') || args.includes('-c')) {
	console.log('🧹 Modo limpieza activado');
	clearCommands()
		.then(() => {
			if (!args.includes('--clear-only')) {
				return registerCommands();
			}
			return Promise.resolve();
		})
		.catch((error) => {
			console.error('❌ Error en el proceso:', error);
			process.exit(1);
		});
} else {
	
	registerCommands();
}


process.on('unhandledRejection', (error) => {
	console.error('❌ Unhandled promise rejection:', error);
	process.exit(1);
});

process.on('uncaughtException', (error) => {
	console.error('❌ Uncaught exception:', error);
	process.exit(1);
});