defmodule Sonora.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
  imports other functionality to make it easier
  to build and query models.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate
  use Plug.Test
  use Phoenix.ConnTest
  @endpoint Sonora.Endpoint

  using do
    quote do
      # Import conveniences for testing with connections
      use Phoenix.ConnTest

      alias Sonora.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query, only: [from: 1, from: 2]
      import Ecto.Model, except: [build: 2]
      import Sonora.Router.Helpers

      # The default endpoint for testing
      @endpoint Sonora.Endpoint

      def login_user, do: Sonora.ConnCase.login_user(conn)
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Sonora.Repo)

    conn = Phoenix.ConnTest.conn()

    if tags[:logged_in] do
      {user, jwt} = login_user(conn)
      conn = Phoenix.ConnTest.conn() |> put_req_header("authorization", jwt)
      {:ok, conn: conn, user: user, jwt: jwt}
    else
      {:ok, conn: Phoenix.ConnTest.conn()}
    end
  end

  def login_user(conn) do
    user = Sonora.Factory.create(:user)
    conn = post conn, "/api/session", %{email: user.email, password: user.password}
    %{"jwt" => jwt} = json_response(conn, 201)
    {user, jwt}
  end
end
