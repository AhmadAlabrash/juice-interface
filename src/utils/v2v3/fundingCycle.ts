import { BigNumber } from '@ethersproject/bignumber'
import {
  V2FundingCycleMetadata,
  V2V3FundingCycle,
} from 'models/v2/fundingCycle'

import unsafeFundingCycleProperties from 'utils/unsafeFundingCycleProperties'

import { fromWad, parseWad } from '../format/formatNumber'

import { FundingCycleRiskFlags } from 'constants/fundingWarningText'
import { MaxUint54 } from 'constants/numbers'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
import { MAX_DISTRIBUTION_LIMIT } from './math'
import {
  SerializedV2V3FundAccessConstraint,
  SerializedV2V3FundingCycleData,
} from './serializers'

export const hasDistributionLimit = (
  fundAccessConstraint: SerializedV2V3FundAccessConstraint | undefined,
): boolean => {
  // Distribution limit defaults to Zero (which is a distribution limit)
  if (!fundAccessConstraint) return true

  return Boolean(
    !parseWad(fundAccessConstraint.distributionLimit).eq(
      MAX_DISTRIBUTION_LIMIT,
    ),
  )
}

export const hasFundingDuration = (
  fundingCycle: Pick<SerializedV2V3FundingCycleData, 'duration'>,
) => Boolean(fundingCycle?.duration && fundingCycle?.duration !== '0')

/**
 * Return the default fund access constraint for a project.
 *
 * Projects can have multiple access constraints. This frontend creates one for them,
 * using the default ETH payment terminal.
 */
export function getDefaultFundAccessConstraint<T>(
  fundAccessConstraints: T[],
): T | undefined {
  return fundAccessConstraints[0]
}

/**
 * Mark various funding cycle properties as "unsafe",
 * based on a subjective interpretation.
 *
 * If a value in the returned object is true, it is potentially unsafe.
 */
export const getUnsafeV2V3FundingCycleProperties = (
  fundingCycle: V2V3FundingCycle,
  fundingCycleMetadata: V2FundingCycleMetadata,
): FundingCycleRiskFlags => {
  const ballot = getBallotStrategyByAddress(fundingCycle.ballot)
  const reservedRatePercentage = parseFloat(
    fromWad(fundingCycleMetadata.reservedRate),
  )
  const allowMinting = Boolean(fundingCycleMetadata.allowMinting)

  return unsafeFundingCycleProperties({
    ballot,
    reservedRatePercentage,
    hasFundingDuration: fundingCycle.duration?.gt(0),
    allowMinting,
  })
}

/**
 * Return number of risk indicators for a funding cycle.
 * 0 if we deem a project "safe" to contribute to.
 */
export const getV2V3FundingCycleRiskCount = (
  fundingCycle: V2V3FundingCycle,
  fundingCycleMetadata: V2FundingCycleMetadata,
): number => {
  return Object.values(
    getUnsafeV2V3FundingCycleProperties(fundingCycle, fundingCycleMetadata),
  ).filter(v => v === true).length
}

/**
 * _mustStartAtOrAfter + _duration > type(uint54).max
 * @param mustStartAtOrAfter
 */
export const isValidMustStartAtOrAfter = (
  mustStartAtOrAfter: string,
  fundingCycleDuration: BigNumber,
): boolean => {
  return BigNumber.from(mustStartAtOrAfter)
    .add(fundingCycleDuration)
    .lt(MaxUint54)
}