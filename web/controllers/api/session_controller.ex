defmodule Sonora.SessionController do
  use Sonora.Web, :controller

  alias Sonora.User

  def create(conn, %{"email" => email, "password" => password}) do
    case User.authenticate(email, password) do
      {:ok, user} -> create_session(conn, user)
      {:error, msg} ->
        conn
        |> put_status(:unauthorized)
        |> render(Sonora.ErrorView, "error.json", error: msg)
    end
  end

  def delete(conn, _) do
    {:ok, claims} = Guardian.Plug.claims(conn)

    conn
    |> Guardian.Plug.current_token
    |> Guardian.revoke!(claims)

    conn
    |> render("delete.json")
  end

  def create_session(conn, user) do
    {:ok, jwt} = Guardian.encode_and_sign(user, :token)

    conn
    |> put_status(:created)
    |> render(Sonora.SessionView, "show.json", jwt: jwt, user: user)
  end

  def current_user(conn, _) do
    case decode_and_verify(conn) do
      { :ok, user, current_token} ->
        conn
        |> put_status(:ok)
        |> render(Sonora.SessionView, "show.json", jwt: current_token, user: user)

      { :error, reason } ->
        conn
        |> put_status(:unauthorized)
        |> render(Sonora.ErrorView, "error.json", error: reason)
    end
  end

  def decode_and_verify(conn) do
    user = Guardian.Plug.current_resource(conn)
    current_token = Guardian.Plug.current_token(conn)
    invalid_token = {:error, "Invalid token"}

    valid_token? = case user do
      nil -> invalid_token
      _user -> case current_token do
        nil -> invalid_token
        token -> Guardian.decode_and_verify(token)
      end
    end

    case valid_token? do
      {:ok, _} -> {:ok, user, current_token}
      error -> error
    end
  end

  def unauthenticated(conn, _) do
    conn
    |> put_status(:unauthorized)
    |> render(Sonora.ErrorView, "error.json", error: "Not authorized")
  end

end
