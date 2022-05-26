import { useCallback, useRef, useState } from "react"
import { decodeAddress } from "@polkadot/util-crypto"
import { u8aToHex } from "@polkadot/util"
import cx from "clsx"

import { useOutside } from "../../hooks"
import { StepProps } from "../../models"
import { delay } from "../../utils"

import { LinkIcon } from "./LinkIcon"
import "./ContractAddress.css"

interface Props extends Pick<StepProps, "contract" | "setContract"> {}

export function ContractAddress({ contract, setContract }: Props) {
  const [address, setAddress] = useState(contract)
  const [editable, setEditable] = useState(false)
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>()

  const onAddressChange = useCallback((event: any) => {
    const { value } = event.target
    setError(undefined)
    setAddress(value)
  }, [])

  const onApply = useCallback(async () => {
    try {
      const hex = u8aToHex(decodeAddress(address))
      setError(undefined)
      setEditable(false)
      setContract(hex)
    } catch (error) {
      setError("URL is invalid")
      setAddress(contract)
    }
  }, [address])

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
    setAddress(contract)
    setError(undefined)
    setEditable(false)
  }, [])

  useOutside(inputRef, onClickOutside)

  return (
    <div className={cx("contract-address", { invalid: !!error, edit: editable })}>
      <div className="icon">
        <LinkIcon />
      </div>

      {editable ? (
        <>
          {error && <div className="error">{error}</div>}

          <input
            placeholder="Contract address"
            onChange={onAddressChange}
            onKeyDown={onKeyDown}
            ref={inputRef}
            value={address}
            name="address"
          />
        </>
      ) : (
        <div className="meta" onClick={onClickEdit}>
          <div className="label">Contract address</div>
          <div className="address">{address || "Need address hex or ss58"}</div>
        </div>
      )}
    </div>
  )
}
