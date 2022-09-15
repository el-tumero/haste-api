export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        PRIVATE_KEY: string
        MONGO_URI: string
        PORT: string
        ENV: 'test' | 'development' | 'production';
    }
  }
}
