defmodule Sonora.ErrorHelpers do
  use Phoenix.HTML

  @doc """
  Actually we don't need to translate the messages
  """
  def translate_error(msg) do
    msg
  end
end
