defmodule Sonora.ArtistView do
  use Sonora.Web, :view

  def render("index.json", %{artists: artists}) do
    %{data: render_many(artists, Sonora.ArtistView, "artist.json")}
  end

  def render("show.json", %{artist: artist}) do
    %{data: render_one(artist, Sonora.ArtistView, "artist.json")}
  end

  def render("artist.json", %{artist: artist}) do
    %{id: artist.id,
      name: artist.name}
  end
end
