defmodule Sonora.RegistrationController  do
  use Sonora.Web, :controller

  alias Sonora.{Repo, User}

  def create(conn, params) do
    changeset = User.changeset(%User{}, params)
    case Repo.insert(changeset) do
      {:ok, user} -> Sonora.SessionController.create_session(conn, user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Sonora.ErrorView, "error.json", error: changeset)
    end
  end

end
