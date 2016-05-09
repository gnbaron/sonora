defmodule Sonora.ErrorView do
  use Sonora.Web, :view

  def render("error.json", %{error: changeset = %{errors: _errors}}) do
     render("error.json", changeset)
  end

  def render("error.json", %{errors: errors}) do
    errors = Enum.map(errors, fn {field, message} -> {field, parse_error message} end)
    Enum.into(errors, %{})
  end

  def render("error.json", %{error: error}) do
    %{
      error: error
    }
  end

  def render("404.html", _assigns) do
    "Page not found"
  end

  def render("404.json", _assigns) do
    %{error: "Resource not found"}
  end

  def render("400.json", %{reason: %{keys: missing_keys}}) do
    Enum.reduce(missing_keys, %{}, fn key, map ->
      Map.put(map, key, "can't be blank")
    end)
  end

  def render("500.json", %{reason: %{changeset: %{errors: errors}}}) do
    Enum.into(errors, %{})
  end

  def render("500.html", _assigns) do
    "Server internal error"
  end

  # In case no render clause matches or no
  # template is found, let's render it as 500
  def template_not_found(_template, assigns) do
    render "500.html", assigns
  end

  def parse_error({msg, _opts}) do
    msg
  end

end
