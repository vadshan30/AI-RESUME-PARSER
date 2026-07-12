interface EnvConfig {
  apiUrl: string;
  apiVersion: string;
  apiTimeout: number;
  enableAnalytics: boolean;
  enableDebug: boolean;
  maxFileSize: number;
  uploadTimeout: number;
}

function normalizeApiUrl(raw: string | undefined): string {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return '';
  return trimmed.replace(/\/$/, '');
}

class Environment {
  private static instance: Environment;
  private config: EnvConfig;

  private constructor() {
    const fromEnv = normalizeApiUrl(import.meta.env.VITE_API_URL);
    // In dev with empty VITE_API_URL, use same-origin requests → Vite proxy → backend
    const apiUrl = fromEnv || (import.meta.env.DEV ? '' : 'http://127.0.0.1:8000');

    this.config = {
      apiUrl,
      apiVersion: import.meta.env.VITE_API_VERSION || 'v1',
      apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
      uploadTimeout: parseInt(import.meta.env.VITE_UPLOAD_TIMEOUT || '120000', 10),
      enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      enableDebug: import.meta.env.VITE_ENABLE_DEBUG !== 'false',
      maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || String(5 * 1024 * 1024), 10),
    };
  }

  static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  getConfig(): EnvConfig {
    return this.config;
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }
}

export const env = Environment.getInstance();
