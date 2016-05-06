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
    plug Sonora.Plug.EnsureAuthenticated
  end

  scope "/api", SystextilDDP do
    pipe_through :api

    scope "/secured" do
      pipe_through :secured

      # resources that needs authentication

    end

  end

  scope "/", Sonora do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", Sonora do
  #   pipe_through :api
  # end
end
