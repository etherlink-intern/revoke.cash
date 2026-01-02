import { ChainId } from '@revoke.cash/chains';
import { ALCHEMY_API_KEY, DRPC_API_KEY, INFURA_API_KEY, MULTICALL_ADDRESS } from 'lib/constants';
import type { RateLimit } from 'lib/interfaces';
import { AggregatePriceStrategy, AggregationType } from 'lib/price/AggregatePriceStrategy';
import { HardcodedPriceStrategy } from 'lib/price/HardcodedPriceStrategy';
import type { PriceStrategy } from 'lib/price/PriceStrategy';
import { UniswapV2PriceStrategy } from 'lib/price/UniswapV2PriceStrategy';
import { UniswapV3ReadonlyPriceStrategy } from 'lib/price/UniswapV3ReadonlyPriceStrategy';
import { type AddEthereumChainParameter, type PublicClient, toHex, type Chain as ViemChain } from 'viem';
import { Chain, type DeployedContracts, SupportType } from '../chains/Chain';

// =============================================================================
// ETHERLINK-ONLY CONFIGURATION
// This is a minimal build with only Etherlink networks for faster iteration
// To restore full network support: mv lib/utils/chains.ts.full.backup lib/utils/chains.ts
// =============================================================================

export const CHAIN_SELECT_MAINNETS = [
  42793, // Etherlink Mainnet
] as const;

export const CHAIN_SELECT_TESTNETS = [
  128123, // Etherlink Ghostnet
  127823, // Etherlink Shadownet
] as const;

export const ORDERED_CHAINS = [...CHAIN_SELECT_MAINNETS, ...CHAIN_SELECT_TESTNETS] as const;

const MULTICALL = {
  multicall3: {
    address: MULTICALL_ADDRESS,
  },
};

export const CHAINS = {
  // Etherlink Mainnet
  [42793]: new Chain({
    type: SupportType.ETHERSCAN_COMPATIBLE,
    chainId: 42793,
    name: 'Etherlink',
    nativeToken: 'XTZ',
    nativeTokenCoingeckoId: 'tezos',
    logoUrl: '/assets/images/vendor/chains/etherlink.svg',
    infoUrl: 'https://etherlink.com',
    explorerUrl: 'https://explorer.etherlink.com',
    etherscanCompatibleApiUrl: 'https://explorer.etherlink.com/api',
    rpc: {
      main: 'https://rpc.bubbletez.com',
      free: 'https://node.mainnet.etherlink.com',
    },
    deployedContracts: { ...MULTICALL },
    priceStrategy: undefined,
  }),
  // Etherlink Ghostnet Testnet
  [128123]: new Chain({
    type: SupportType.ETHERSCAN_COMPATIBLE,
    chainId: 128123,
    name: 'Etherlink Ghostnet',
    nativeToken: 'XTZ',
    logoUrl: '/assets/images/vendor/chains/etherlink.svg',
    infoUrl: 'https://etherlink.com',
    explorerUrl: 'https://testnet.explorer.etherlink.com',
    etherscanCompatibleApiUrl: 'https://testnet.explorer.etherlink.com/api',
    rpc: {
      main: 'https://node.ghostnet.etherlink.com',
    },
    deployedContracts: { ...MULTICALL },
    isTestnet: true,
    correspondingMainnetChainId: 42793,
  }),
  // Etherlink Shadownet Testnet
  [127823]: new Chain({
    type: SupportType.ETHERSCAN_COMPATIBLE,
    chainId: 127823,
    name: 'Etherlink Shadownet',
    nativeToken: 'XTZ',
    logoUrl: '/assets/images/vendor/chains/etherlink.svg',
    infoUrl: 'https://etherlink.com',
    explorerUrl: 'https://shadownet.explorer.etherlink.com',
    etherscanCompatibleApiUrl: 'https://shadownet.explorer.etherlink.com/api',
    rpc: {
      main: 'https://node.shadownet.etherlink.com',
    },
    deployedContracts: { ...MULTICALL },
    isTestnet: true,
    correspondingMainnetChainId: 42793,
  }),
} as const;

export type SupportedChainId = (typeof ORDERED_CHAINS)[number];
export type DocumentedChainId = keyof typeof CHAINS;

export const isSupportedChain = (chainId: number): chainId is SupportedChainId => {
  return ORDERED_CHAINS.includes(chainId as any);
};

export const getChainName = (chainId: DocumentedChainId): string => {
  return CHAINS[chainId].getName();
};

export const getChainSlug = (chainId: DocumentedChainId): string => {
  return CHAINS[chainId].getSlug();
};

export const getChainNativeToken = (chainId: DocumentedChainId): string => {
  return CHAINS[chainId].getNativeToken();
};

export const getChainLogoUrl = (chainId: DocumentedChainId): string => {
  return CHAINS[chainId].getLogoUrl();
};

export const getChainInfoUrl = (chainId: DocumentedChainId): string | undefined => {
  return CHAINS[chainId].getInfoUrl();
};

export const getChainExplorerUrl = (chainId: DocumentedChainId): string | undefined => {
  return CHAINS[chainId].getExplorerUrl();
};

export const isTestnet = (chainId: DocumentedChainId): boolean => {
  return CHAINS[chainId].isTestnet();
};

export const isTestnetChain = (chainId: DocumentedChainId): boolean => {
  return getChainConfig(chainId).isTestnet();
};

export const getChainConfig = (chainId: DocumentedChainId): Chain => {
  return CHAINS[chainId];
};

export const getChainRpcUrl = (chainId: DocumentedChainId): string | undefined => {
  return CHAINS[chainId].getRpcUrl();
};

export const getChainLogsRpcUrl = (chainId: DocumentedChainId): string | undefined => {
  return CHAINS[chainId].getLogsRpcUrl();
};

export const getChainFreeRpcUrl = (chainId: DocumentedChainId): string | undefined => {
  return CHAINS[chainId].getFreeRpcUrl();
};

export const getChainRateLimit = (chainId: DocumentedChainId): RateLimit | undefined => {
  return CHAINS[chainId].getRateLimit();
};

export const getChainApiIdentifer = (chainId: DocumentedChainId): string => {
  return getChainConfig(chainId).getEtherscanCompatibleApiIdentifier();
};

export const getCorrespondingMainnetChainId = (chainId: DocumentedChainId): number | undefined => {
  return getChainConfig(chainId).getCorrespondingMainnetChainId();
};

export const getChainDeployedContracts = (chainId: DocumentedChainId): DeployedContracts | undefined => {
  return getChainConfig(chainId).getDeployedContracts();
};

export const getViemChainConfig = (chainId: DocumentedChainId): ViemChain => {
  return getChainConfig(chainId).getViemChainConfig();
};

export const createViemPublicClientForChain = (chainId: DocumentedChainId, url?: string): PublicClient => {
  return getChainConfig(chainId).createViemPublicClient(url);
};

export const getChainAddEthereumChainParameter = (chainId: DocumentedChainId): AddEthereumChainParameter => {
  return getChainConfig(chainId).getAddEthereumChainParameter();
};

export const getChainPriceStrategy = (chainId: DocumentedChainId): PriceStrategy | undefined => {
  return getChainConfig(chainId).getPriceStrategy();
};

export const getChainBackendPriceStrategy = (chainId: DocumentedChainId): PriceStrategy | undefined => {
  return getChainConfig(chainId).getBackendPriceStrategy();
};
