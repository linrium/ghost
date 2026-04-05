// biome-ignore lint/style/noNamespace: no comment
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    R2_ACCESS_KEY_ID: string
    R2_ACCOUNT_ID: string
    R2_BUCKET_NAME: string
    R2_SECRET_ACCESS_KEY: string
  }
}
