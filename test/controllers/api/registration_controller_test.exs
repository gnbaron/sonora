defmodule Sonora.RegistrationControllerTest do
  use Sonora.ConnCase

  import Sonora.Factory

  @user %{name: "John Doe", email: "teste@test.com", password: "master", password_confirmation: "master"}

  test "registration with valid data" do
    conn = post conn, "/api/registration", @user
    %{"jwt" => jwt, "user" => user} = json_response(conn, 201)
    refute is_nil(jwt)
    refute is_nil(user)
  end

  test "registration with user email already taken" do
    create(:user, @user)
    conn = post conn, "/api/registration", @user
    json = json_response(conn, 422)
    assert %{"email" => "Email already taken"} = json
  end

  test "password confirmation" do
    user = @user |> Map.put(:password_confirmation, "invalid")
    conn = post conn, "/api/registration", user
    json = json_response(conn, 422)
    assert %{"password_confirmation" => "Password does not match"} = json
  end

end
