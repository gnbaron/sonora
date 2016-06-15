defmodule Sonora.Router do
  use Sonora.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  pipeline :secured do
    plug Sonora.Plug.AuthVerify
  end

  scope "/api", Sonora do
    pipe_through :api

    post "/registration", RegistrationController, :create

    scope "/session" do
      post "/", SessionController, :create
      delete "/", SessionController, :delete
      get "/current_user", SessionController, :current_user
    end

    scope "/secured" do
      pipe_through :secured

      scope "/users" do
        post "/:user_id", UserController, :update
      end

      resources "/genres", GenreController, except: [:new, :edit]

    end

  end

  scope "/", Sonora do
    pipe_through :browser # Use the default browser stack

    get "*path", PageController, :index
  end

end
