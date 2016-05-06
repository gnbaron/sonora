use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :sonora, Sonora.Endpoint,
  http: [port: 4001],
  server: true,
  debug_errors: false,
  catch_errors: true,
  watchers: []

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :sonora, Sonora.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "sonora_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox,
  ownership_timeout: 300000

# Guardian configuration
config :guardian, Guardian,
  secret_key: "W9cDv9fjPtsYv2gItOcFb5PzmRzqGkrOsJGmby0KpBOlHJIlhxMKFmIlcCG9PVFQ"
