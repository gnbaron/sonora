defmodule Sonora.UserView do
  use Sonora.Web, :view

  def render("show.json", %{user: user}) do
    user
  end

end
