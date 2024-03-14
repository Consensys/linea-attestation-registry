import { describe, expect, it } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';
import { heading, panel } from '@metamask/snaps-sdk';

describe('onHomePage', () => {
  it('returns custom UI', async () => {
    const { onHomePage } = await installSnap();

    const response = await onHomePage();
    expect(response).toRender(panel([heading('No attestation found')]));
  });
});
