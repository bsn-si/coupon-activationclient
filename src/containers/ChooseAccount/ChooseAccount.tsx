import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"

import { EnrichedAccount, Step, StepProps } from "../../models"
import { Account } from "../../components"
import "./ChooseAccount.css"

export function ChooseAccount({
  account: currentAccount,
  setAccount,
  setStep,
  api,
}: StepProps) {
  // prettier-ignore
  const [accounts, setAccounts] = useState<EnrichedAccount[]>([])
  const [error, setError] = useState<string>()

  const getAccounts = useCallback(async () => {
    try {
      const extensions = await api.requestAccess()

      if (extensions.length > 0) {
        const accounts = await api.accounts()

        if (accounts.length > 0) {
          setAccounts(accounts)
        } else {
          // prettier-ignore
          setError(
            "You don't have allowed accounts on extension." +
            "\n" +
            "Install extension, or allow dapp for this site.",
          )
        }
      } else {
        setError("No extension installed, or the user\ndid not accept the authorization")
      }
    } catch (error: any) {
      console.error(error)
      setError(error.message)
    }
  }, [api])

  const onChooseAccount = useCallback(
    (account: EnrichedAccount) => {
      setAccount(account)
      setStep(Step.Coupon)
    },
    [setAccount, setStep],
  )

  useEffect(() => {
    getAccounts()
  }, [getAccounts])

  return (
    <motion.div
      className="step choose-account"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="header">
        <h2 className="title">Choose Account</h2>
        <h4 className="subtitle">Who call contract & receive funds</h4>
      </div>

      {!!accounts.length && (
        <div className="accounts-list">
          {accounts.map(account => {
            const active = currentAccount && currentAccount.address === account.address
            const disabled = account.balance.isZero()

            return (
              <Account
                onClick={onChooseAccount}
                key={account.address}
                disabled={disabled}
                active={active}
                {...account}
              />
            )
          })}
        </div>
      )}

      {error && <div className="error message">{error}</div>}
    </motion.div>
  )
}
