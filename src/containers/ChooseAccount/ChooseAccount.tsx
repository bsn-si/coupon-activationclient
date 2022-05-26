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
      await api.requestAccess()

      const accounts = await api.accounts()
      setAccounts(accounts)
    } catch (error: any) {
      console.error(error)
      setError(error.message)
    }
  }, [api])

  const onChooseAccount = useCallback(
    (account: EnrichedAccount) => {
      setAccount(account)
    },
    [setAccount],
  )

  const onGoCoupon = useCallback(() => {
    if (currentAccount) {
      setStep(Step.Coupon)
    }
  }, [currentAccount, setStep])

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

      <div className="accounts-list">
        {accounts.map(account => {
          const active = currentAccount && currentAccount.address === account.address

          return (
            <Account
              onClick={onChooseAccount}
              key={account.address}
              active={active}
              {...account}
            />
          )
        })}
      </div>

      {error && <div className="error message">{error}</div>}

      {currentAccount && (
        <button className="button glow" onClick={onGoCoupon}>
          Continue
        </button>
      )}
    </motion.div>
  )
}
