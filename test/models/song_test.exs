defmodule Sonora.SongTest do
  use Sonora.ModelCase

  alias Sonora.Song

  @valid_attrs %{title: "some content", url: "http://www.test.com.br/test.mp3", artist_id: 1, genre_id: 1}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Song.changeset(%Song{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Song.changeset(%Song{}, @invalid_attrs)
    refute changeset.valid?
  end
end
