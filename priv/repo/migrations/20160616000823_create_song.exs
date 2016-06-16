defmodule Sonora.Repo.Migrations.CreateSong do
  use Ecto.Migration

  def change do
    create table(:songs) do
      add :title, :string
      add :artist_id, references(:artists, on_delete: :nothing)
      add :genre_id, references(:genres, on_delete: :nothing)

      timestamps
    end
    create index(:songs, [:artist_id])
    create index(:songs, [:genre_id])

  end
end
