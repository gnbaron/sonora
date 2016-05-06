defmodule Sonora.Plug.AuthVerify do
  @moduledoc """
  This plug ensures that a valid JWT was provided and has been
  verified on the request.

  If one is not found, the `Sonora.SessionController.unauthenticated/2` function is invoked with the
  `Plug.Conn.t` object and its params.

  ## Example
      plug Sonora.AuthVerify
  """
  import Plug.Conn

  @doc false
  def init(ops), do: ops
  @doc false
  def call(conn, _) do
    case Sonora.SessionController.decode_and_verify(conn) do
      {:error, error} ->
        conn
        |> put_status(:unauthorized)
        |> Phoenix.Controller.render(Sonora.ErrorView, "error.json", error: error)
        |> halt
      {:ok, user, _jwt} -> Guardian.Plug.set_current_resource(conn, user, :default)
    end
  end

end
