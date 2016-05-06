defmodule Sonora.Factory do
  use ExMachina.Ecto, repo: Sonora.Repo

  alias Sonora.{User}

  def factory(:user) do
    %User{
      name: sequence(:name, &"Name #{&1}"),
      email: sequence(:email, &"email-#{&1}@foo.com"),
      encrypted_password: User.encrypt_password("test"),
      password: "test"
    }
  end

end
