defmodule Sonora.GuardianSerializer do
  @behaviour Guardian.Serializer
  import SystextilDDP.Gettext

  alias Sonora.{Repo, User}

  def for_token(user = %User{}), do: { :ok, "User:#{user.id}" }
  def for_token(_), do: { :error, dgettext("errors", "Unknown resource type") }

  def from_token("User:" <> id), do: { :ok, Repo.get(User, String.to_integer(id)) }
  def from_token(_), do: { :error, dgettext("errors", "Unknown resource type") }
end
