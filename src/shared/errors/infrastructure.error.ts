/**
 * Errores de infraestructura
 */

export class InfrastructureError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InfrastructureError';
	}
}

export class ExternalApiError extends InfrastructureError {
	constructor(apiName: string, message: string, public statusCode?: number) {
		super(`${apiName} API error: ${message}`);
		this.name = 'ExternalApiError';
	}
}

export class CacheError extends InfrastructureError {
	constructor(message: string) {
		super(`Cache error: ${message}`);
		this.name = 'CacheError';
	}
}

export class RepositoryError extends InfrastructureError {
	constructor(repositoryName: string, operation: string, message: string) {
		super(`${repositoryName} ${operation} failed: ${message}`);
		this.name = 'RepositoryError';
	}
}
