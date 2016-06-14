defmodule Sonora.GenreView do
  use Sonora.Web, :view

  def render("index.json", %{genres: genres}) do
    %{data: render_many(genres, Sonora.GenreView, "genre.json")}
  end

  def render("show.json", %{genre: genre}) do
    %{data: render_one(genre, Sonora.GenreView, "genre.json")}
  end

  def render("genre.json", %{genre: genre}) do
    %{id: genre.id,
      description: genre.description}
  end
end
