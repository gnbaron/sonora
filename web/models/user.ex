defmodule Sonora.User do
  use Sonora.Web, :model

  alias Sonora.{Repo, User}

  @valid_email_format ~r/\A([\w+\-].?)+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/

  schema "users" do
    field :name, :string
    field :email, :string
    field :encrypted_password, :string
    field :password, :string, virtual: true

    timestamps
  end

  @required_fields ~w(name email password)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> validate_required([:name, :email, :password])
    |> validate_format(:email, @valid_email_format)
    |> unique_constraint(:email, message: "Email already taken")
    |> validate_confirmation(:password, message: "Password does not match")
    |> add_encrypted_password
  end


  @doc """
  Try to authenticate a User with the given password.

  Returns {:ok, user} when the authenticate succeed or {:error, msg}
  otherwise
  """
  def authenticate(email, password) do
    user = Repo.get_by(User, email: String.downcase(email))
    fail = &{:error, &1}
    cond do
      is_nil(user) -> fail.("Invalid email or password")
      user.encrypted_password != encrypt_password(password) -> fail.("Invalid email or password")
      true -> {:ok, user}
    end
  end

  defp add_encrypted_password(current_changeset) do
    case current_changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        encrypted_password = encrypt_password(password)
        put_change(current_changeset, :encrypted_password, encrypted_password)
      _ ->
        current_changeset
    end
  end

  def encrypt_password(password) do
    secret = Application.get_env(:sonora, Sonora.Endpoint)[:secret_key_base]
    :crypto.hmac(:sha256, secret, password) |> Base.encode64
  end

end
