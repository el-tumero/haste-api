export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        PRIVATE_KEY: string
        MONGO_URI: string
        PORT: number
        ENV: 'test' | 'development' | 'production';
    }
  }
}
