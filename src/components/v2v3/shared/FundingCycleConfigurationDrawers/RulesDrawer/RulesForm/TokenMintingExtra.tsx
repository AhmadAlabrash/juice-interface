import { Space } from 'antd'
import FormItemWarningText from 'components/FormItemWarningText'
import {
  OWNER_MINTING_EXPLAINATION,
  OWNER_MINTING_RISK,
} from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'

export default function TokenMintingExtra({
  showMintingWarning,
}: {
  showMintingWarning: boolean
}) {
  return (
    <Space direction="vertical">
      {OWNER_MINTING_EXPLAINATION}
      {showMintingWarning && (
        <FormItemWarningText>{OWNER_MINTING_RISK}</FormItemWarningText>
      )}
    </Space>
  )
}
