ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Sonora.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Sonora.Repo --quiet)

Ecto.Adapters.SQL.Sandbox.mode(Sonora.Repo, :manual)

{:ok, _} = Application.ensure_all_started(:ex_machina)
