import { useCallback, useRef, useState } from "react"
import cx from "clsx"

import { useOutside } from "../../hooks"
import { StepProps } from "../../models"
import { delay } from "../../utils"

import { GlobeIcon } from "./GlobeIcon"
import "./RpcUrl.css"

interface Props extends Pick<StepProps, "api"> {}

export function RpcUrl({ api }: Props) {
  const [editable, setEditable] = useState(false)
  const [error, setError] = useState<string>()
  const [url, setUrl] = useState(api.apiUrl)
  const inputRef = useRef<HTMLInputElement>()

  const onUrlChange = useCallback((event: any) => {
    const { value } = event.target
    setError(undefined)
    setUrl(value)
  }, [])

  const onApply = useCallback(async () => {
    try {
      const { protocol } = new URL(url)

      if (protocol !== "ws:") {
        setError("Accepts only ws:// addresses")
      } else {
        await api.connect(url)
        setError(undefined)
        setEditable(false)
      }
    } catch (error) {
      if (error instanceof TypeError) {
        setError("URL is invalid")
      } else {
        setError(`Can't connect to "${url}"`)
        setUrl(api.apiUrl)
      }
    }
  }, [api, url])

  const onKeyDown = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onApply()
      }
    },
    [onApply],
  )

  const onClickEdit = useCallback(async () => {
    setEditable(true)
    await delay(50)

    inputRef?.current?.focus()
  }, [])

  const onClickOutside = useCallback(async () => {
    setUrl(api.apiUrl)
    setError(undefined)
    setEditable(false)
  }, [])

  useOutside(inputRef, onClickOutside)

  return (
    <div className={cx("rpc-url", { invalid: !!error, edit: editable })}>
      <GlobeIcon className="icon" />

      {editable ? (
        <>
          {error && <div className="error">{error}</div>}

          <input
            placeholder="RPC websocket url"
            onChange={onUrlChange}
            onKeyDown={onKeyDown}
            ref={inputRef}
            value={url}
            name="url"
          />
        </>
      ) : (
        <div className="meta" onClick={onClickEdit}>
          <div className="label">RPC websocket url</div>
          <div className="url">{url || "Please enter node url"}</div>
        </div>
      )}
    </div>
  )
}
