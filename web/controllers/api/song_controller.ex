defmodule Sonora.SongController do
  use Sonora.Web, :controller

  alias Sonora.Song

  plug :scrub_params, "song" when action in [:create, :update]

  def index(conn, _params) do
    songs = Repo.all(Song)
    render(conn, "index.json", songs: songs)
  end

  def create(conn, %{"song" => song_params}) do
    changeset = Song.changeset(%Song{}, song_params)

    case Repo.insert(changeset) do
      {:ok, song} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", song_path(conn, :show, song))
        |> render("show.json", song: song)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Sonora.ErrorView, "error.json", error: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    song = Repo.get!(Song, id)
    render(conn, "show.json", song: song)
  end

  def update(conn, %{"id" => id, "song" => song_params}) do
    song = Repo.get!(Song, id)
    changeset = Song.changeset(song, song_params)

    case Repo.update(changeset) do
      {:ok, song} ->
        render(conn, "show.json", song: song)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Sonora.ErrorView, "error.json", error: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    song = Repo.get!(Song, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(song)

    send_resp(conn, :no_content, "")
  end
end
