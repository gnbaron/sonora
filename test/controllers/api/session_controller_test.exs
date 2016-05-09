defmodule Sonora.SessionControllerTest do
  use Sonora.ConnCase

  import Sonora.Factory

  test "login with valid user" do
    user = create(:user)
    conn = post conn, "/api/session", %{email: user.email, password: user.password}
    %{"jwt" => jwt, "user" => user} = json_response(conn, 201)
    refute is_nil(jwt)
    refute is_nil(user)
  end

  test "login with invalid user" do
    user = create(:user)
    tryLogin = fn login_data ->
      conn = post conn, "/api/session", login_data
      json_response(conn, 401)
    end
    invalid_email = %{email: "invalid", password: user.password}
    assert tryLogin.(invalid_email) == %{"error" => "Invalid email or password"}
    invalid_password = %{email: user.email, password: "invalid"}
    assert tryLogin.(invalid_password) == %{"error" => "Invalid email or password"}
  end

  test "login with blank params"  do
    tryLogin = fn login_data ->
      conn = post conn, "/api/session", login_data
      json_response(conn, 401)
    end
    %{"error" => "Invalid email or password"} = tryLogin.(%{email: "", password: ""})
    %{"error" => "Invalid email or password"} = tryLogin.(%{email: "p@p.com", password: ""})
  end

  test "logout" do
    user = create(:user)
    conn = post conn, "/api/session", %{email: user.email, password: user.password}
    %{"jwt" => jwt} = json_response(conn, 201)

    conn = conn()
      |> put_req_header("authorization", jwt)
      |> delete("/api/session")

    res = json_response(conn, 200)
    assert res == %{"ok" => true}
  end

  test "login with valid token" do
    user = create(:user)
    conn = post conn, "/api/session", %{email: user.email, password: user.password}
    %{"jwt" => jwt, "user" => user} = json_response(conn, 201)

    conn = conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/session/current_user")

    %{"user" => logged_user} = json_response(conn, 200)
    assert logged_user == user
  end

  test "login with invalid token" do
    conn = conn()
      |> put_req_header("authorization", "an_invalid_token")
      |> get("/api/session/current_user")

    res = json_response(conn, 401)
    assert res == %{"error" => "Invalid token"}
  end

  test "login with expired token" do

    env = Application.get_env(:guardian, Guardian)
    old_ttl = env[:ttl]
    Application.put_env(:guardian, Guardian, Keyword.put(env, :ttl, {1, :millis}))

    user = create(:user)
    {:ok, jwt, _} = Guardian.encode_and_sign(user, :token, Guardian.Claims.app_claims)

    :timer.sleep(1000)
    conn = conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/session/current_user")

    Application.put_env(:guardian, Guardian, Keyword.put(env, :ttl, old_ttl))

    res = json_response(conn, 401)
    assert res == %{"error" => "Invalid token"}
  end

  test "create session with valid token and user is nill" do
    user = create(:user)
    conn = post conn, "/api/session", %{email: user.email, password: user.password}
    %{"jwt" => jwt, "user" => user} = json_response(conn, 201)

    user_repo = Sonora.Repo.get_by(Sonora.User, id: user["id"]);
    Sonora.Repo.delete(user_repo)

    conn = conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/session/current_user")

      res = json_response(conn, 401)
      assert res == %{"error" => "Invalid token"}
  end

end
