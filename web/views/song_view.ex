defmodule Sonora.SongView do
  use Sonora.Web, :view

  def render("index.json", %{songs: songs}) do
    %{data: render_many(songs, Sonora.SongView, "song.json")}
  end

  def render("show.json", %{song: song}) do
    %{data: render_one(song, Sonora.SongView, "song.json")}
  end

  def render("song.json", %{song: song}) do
    %{id: song.id,
      title: song.title,
      artist_id: song.artist_id,
      genre_id: song.genre_id}
  end
end
