import { LoadingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import { PayButtonProps } from 'components/inputs/Pay/PayInputGroup'
import PayWarningModal from 'components/PayWarningModal'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useWeiConverter from 'hooks/WeiConverter'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext, useState } from 'react'
import { V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { V2ConfirmPayModal } from './V2ConfirmPayModal'

export default function V2PayButton({
  payAmount,
  payInCurrency,
  onError,
  disabled,
  wrapperStyle,
}: PayButtonProps) {
  const {
    fundingCycleMetadata,
    loading: { fundingCycleLoading },
  } = useContext(V2V3ProjectContext)
  const { projectMetadata, isArchived } = useContext(ProjectMetadataContext)

  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const weiPayAmt = useWeiConverter<V2V3CurrencyOption>({
    currency: payInCurrency as V2V3CurrencyOption,
    amount: payAmount,
  })

  const payButtonText = projectMetadata?.payButton?.length
    ? projectMetadata.payButton
    : t`Pay`

  let disabledMessage: string | undefined
  if (isArchived) {
    disabledMessage = t`This project is archived and can't be paid.`
  } else if (fundingCycleMetadata?.pausePay) {
    disabledMessage = t`Payments are paused in this funding cycle.`
  }

  const isPayDisabled =
    Boolean(disabledMessage) || disabled || fundingCycleLoading

  return (
    <div style={{ textAlign: 'center', ...wrapperStyle }}>
      <Tooltip
        visible={isPayDisabled ? undefined : false}
        title={disabledMessage}
        className="block"
      >
        <Button
          style={{ width: '100%' }}
          type="primary"
          onClick={() => {
            if (weiPayAmt?.eq(0)) {
              return onError?.()
            }
            setPayWarningModalVisible(true)
          }}
          disabled={isPayDisabled}
        >
          {fundingCycleLoading ? <LoadingOutlined /> : payButtonText}
        </Button>
      </Tooltip>
      {payInCurrency === V2V3_CURRENCY_USD && (
        <div style={{ fontSize: '.7rem' }}>
          <Trans>
            Paid as <ETHAmount amount={weiPayAmt} />
          </Trans>
        </div>
      )}

      <PayWarningModal
        visible={payWarningModalVisible}
        onOk={() => {
          setPayWarningModalVisible(false)
          setPayModalVisible(true)
        }}
        onCancel={() => setPayWarningModalVisible(false)}
      />
      <V2ConfirmPayModal
        visible={payModalVisible}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={weiPayAmt}
      />
    </div>
  )
}