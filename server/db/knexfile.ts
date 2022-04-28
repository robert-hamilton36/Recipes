import path from "path"

const config: Config = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "dev.sqlite3"),
    },
    useNullAsDefault: true,
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
}

export default config

interface Config {
  // type key as 'production' | 'test' | 'development'
  // which will requires casting process.env.NODE_ENV
  [key: string]: DBOptions
}

interface DBOptions {
  client: string
  connection: string | undefined | FilenameObj
  useNullAsDefault?: boolean
  pool?: {
    min: number
    max: number
  }
  migrations?: {
    tableName: string
  }
}

interface FilenameObj {
  filename: string
}
