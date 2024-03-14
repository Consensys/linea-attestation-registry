import type {
  OnHomePageHandler,
  OnTransactionHandler,
} from '@metamask/snaps-sdk';

import { getAttestationsForAddress } from './service';
import { showAttestationList } from './ui';
import { getAccount, getChainId, setState } from './utils';

export const onHomePage: OnHomePageHandler = async () => {
  const locale = await snap.request({ method: 'snap_getLocale' });
  let captions;
  try {
    captions = await import(`../locales/${locale}.json`);
  } catch (error) {
    console.error(
      `Cannot find localized files for lang '${locale}'. Switching to default 'en'`,
    );
    captions = await import(`../locales/en.json`);
  }

  const myAccount = await getAccount();
  const chainId = await getChainId();
  const attestations = await getAttestationsForAddress(chainId, myAccount);

  await setState({
    captions,
    attestations,
  });

  return showAttestationList();
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const locale = await snap.request({ method: 'snap_getLocale' });
  let captions;
  try {
    captions = await import(`../locales/${locale}.json`);
  } catch (error) {
    console.error(
      `Cannot find localized files for lang '${locale}'. Switching to default 'en'`,
    );
    captions = await import(`../locales/en.json`);
  }

  const attestations = await getAttestationsForAddress(chainId, transaction.to);

  await setState({
    captions,
    attestations,
  });

  return showAttestationList();
};
