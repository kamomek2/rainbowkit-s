/* eslint-disable sort-keys-fix/sort-keys-fix */
import type { InjectedConnectorOptions } from '@wagmi/core/connectors/injected';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';

export interface BnbChainWalletOptions {
  chains: Chain[];
}

declare global {
  interface Window {
    BinanceChain: any;
  }
}

export const bnbchainWallet = ({
  chains,
  ...options
}: BnbChainWalletOptions & InjectedConnectorOptions): Wallet => ({
  id: 'bnbchain',
  name: 'BnbChain',
  iconBackground: '#0B0E11',
  iconUrl: async () => (await import('./bnbchainWallet.svg')).default,
  downloadUrls: {
    chrome:
      'https://chromewebstore.google.com/detail/bnb-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp',
    browserExtension: 'https://bnbchain.xyz',
  },
  installed:
    typeof window !== 'undefined' &&
    typeof window.BinanceChain !== 'undefined' &&
    window['BinanceChain']
      ? true
      : undefined,
  createConnector: () => {
    return {
      connector: new InjectedConnector({
        chains,
        options: {
          getProvider: () => {
            const getBnbChain = (BinanceChain?: any) =>
              BinanceChain?.isTally ? BinanceChain : undefined;
            if (typeof window === 'undefined') return;
            return getBnbChain(window.BinanceChain);
          },
          ...options,
        },
      }),
      extension: {
        instructions: {
          learnMoreUrl:
            'https://docs.bnbchain.org/bnb-smart-chain/developers/wallet-configuration/?h=wallet',
          steps: [
            {
              description:
                'We recommend pinning BnbChain to your taskbar for quicker access to your wallet.',
              step: 'install',
              title: 'Install the BnbChain extension',
            },
            {
              description:
                'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
              step: 'create',
              title: 'Create or Import a Wallet',
            },
            {
              description:
                'Once you set up your wallet, click below to refresh the browser and load up the extension.',
              step: 'refresh',
              title: 'Refresh your browser',
            },
          ],
        },
      },
    };
  },
});
