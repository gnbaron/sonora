defmodule Sonora.Repo.Migrations.CreateGenre do
  use Ecto.Migration

  def change do
    create table(:genres) do
      add :description, :string

      timestamps
    end

  end
end
