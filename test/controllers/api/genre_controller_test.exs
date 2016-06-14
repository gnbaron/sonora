defmodule Sonora.GenreControllerTest do
  use Sonora.ConnCase

  alias Sonora.Genre
  @valid_attrs %{description: "some content"}
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  @tag :logged_in
  test "lists all entries on index", %{conn: conn} do
    conn = get conn, genre_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  @tag :logged_in
  test "shows chosen resource", %{conn: conn} do
    genre = Repo.insert! %Genre{}
    conn = get conn, genre_path(conn, :show, genre)
    assert json_response(conn, 200)["data"] == %{"id" => genre.id,
      "description" => genre.description}
  end

  @tag :logged_in
  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, genre_path(conn, :show, -1)
    end
  end

  @tag :logged_in
  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, genre_path(conn, :create), genre: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Genre, @valid_attrs)
  end

  @tag :logged_in
  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, genre_path(conn, :create), genre: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  @tag :logged_in
  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    genre = Repo.insert! %Genre{}
    conn = put conn, genre_path(conn, :update, genre), genre: @valid_attrs
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Genre, @valid_attrs)
  end

  @tag :logged_in
  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    genre = Repo.insert! %Genre{}
    conn = put conn, genre_path(conn, :update, genre), genre: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  @tag :logged_in
  test "deletes chosen resource", %{conn: conn} do
    genre = Repo.insert! %Genre{}
    conn = delete conn, genre_path(conn, :delete, genre)
    assert response(conn, 204)
    refute Repo.get(Genre, genre.id)
  end
end
