import { useState } from 'react';
import { Attestation } from '@verax-attestation-registry/verax-sdk/lib/types/.graphclient';
import { Check, Copy } from 'lucide-react';
import ReactJson from 'react-json-view';
import { EyeOffIcon } from 'lucide-react';

import { getAttestationData } from './utils';

export const AttestationData: React.FC<Attestation> = ({ ...attestation }) => {
  const [copied, setCopied] = useState(false);

  const { schemaString, decodedData } = attestation;
  const data = schemaString && decodedData ? getAttestationData(schemaString, decodedData) : null;

  const handleCopy = () => {
    if (!data || !Object.keys(data).length) return;
    const stringToCopy = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(stringToCopy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const Icon = copied ? Check : Copy;

  return (
    <div className="flex flex-col w-full max-w-[773px] min-h-[256px] items-start gap-6 p-6 special-border-3">
      <div className="flex items-start justify-between w-full">
        <div className="w-fit font-semibold text-[#161517] text-xl tracking-[0]">Attestation Data</div>
        <Icon className="cursor-pointer hover:opacity-60" color={copied ? '#1a9d37' : '#64687D'} onClick={handleCopy} />
      </div>
      <div className="bg-[#F4F5F9] rounded-lg p-4 pe-3 w-full min-h-[160px]">
        {!data ? (
          <div className="flex gap-2 text-base text-[#6d6f73] w-full justify-center h-full items-center">
            <EyeOffIcon />
            Empty
          </div>
        ) : (
          <div className="flex flex-col w-full pe-1 items-start h-[160px] overflow-auto text-[#6d6f73] text-sm scrollbar">
            <ReactJson
              src={data}
              name={false}
              displayObjectSize={false}
              displayDataTypes={false}
              collapsed={false}
              enableClipboard={false}
              quotesOnKeys={false}
              sortKeys={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
