import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useContext } from 'react'

const TooltipDescription = () => {
  return (
    <Trans>
      This Juicebox V3 project also has a project on Juicebox V1 and/or V2. The
      project owner is allowing you to swap your legacy tokens (V1 or V2)ƒ for
      V3 tokens.
    </Trans>
  )
}

export function TokenSwapDescription() {
  const { projectMetadata } = useContext(ProjectMetadataContext)

  return (
    <div>
      <p className="mb-2">
        <Trans>
          You have <span className="font-medium">{projectMetadata?.name}</span>{' '}
          tokens in one or more of their legacy projects. You can swap your
          legacy <span className="font-medium">{projectMetadata?.name}</span>{' '}
          tokens for their current V3 tokens.
        </Trans>{' '}
        <TooltipIcon tip={<TooltipDescription />} />
      </p>
    </div>
  )
}