import { divider, heading, panel, row, text } from '@metamask/snaps-sdk';

import { getState } from './utils';

/**
 * Show the attestation list page.
 * @returns The attestation list page.
 */
export async function showAttestationList() {
  const snapState = await getState();
  const attestations = snapState?.myAttestations ?? [];
  const captions = snapState?.captions;

  const attestationItems = await Promise.all(
    attestations.map(async (attestation) => [
      divider(),
      row(captions?.detail.from, text(attestation.from)),
      row(
        captions?.detail.attestedOn,
        text(new Date(attestation.attestationDate).toDateString()),
      ),
      row(
        captions?.detail.expiry,
        text(new Date(attestation.expiryDate).toDateString()),
      ),
      row(captions?.detail.content, text(attestation.content)),
    ]),
  );

  const headingCaption =
    attestations.length > 0
      ? (captions?.detail.caption as string).replace(
          '{count}',
          `${attestationItems.length}`,
        )
      : (captions?.noAttestations as string);

  return {
    content: panel([heading(headingCaption), ...attestationItems.flat()]),
  };
}
