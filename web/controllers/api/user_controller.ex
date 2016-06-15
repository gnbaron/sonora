defmodule Sonora.UserController  do
  use Sonora.Web, :controller
  import Guardian.Plug
  alias Sonora.{Repo, User}

  def update(conn, user_params) do
    update = Repo.get!(User, user_params["user_id"])
      |> User.changeset(user_params)
      |> Repo.update

    case update do
      {:ok, updated} ->
        conn
        |> put_status(:ok)
        |> render(Sonora.UserView, "show.json", user: updated)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Sonora.ErrorView, "error.json", changeset)
    end
  end

end
