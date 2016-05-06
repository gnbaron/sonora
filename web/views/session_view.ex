defmodule Sonora.SessionView do
  use Sonora.Web, :view

  def render("show.json", %{jwt: jwt, user: user}) do
    %{
      jwt: jwt,
      user: user
    }
  end

  def render("delete.json", _) do
    %{ok: true}
  end

end
