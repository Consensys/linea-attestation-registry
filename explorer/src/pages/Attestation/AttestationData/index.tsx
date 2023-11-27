import { useState } from 'react';
import { Attestation } from '@verax-attestation-registry/verax-sdk/lib/types/.graphclient';
import { Check, Copy } from 'lucide-react';

import { EMPTY_STRING } from '@/constants';

export const AttestationData: React.FC<Attestation> = ({ ...attestation }) => {
  const [copied, setCopied] = useState(false);

  const { schemaString, decodedData } = attestation;
  let list: Array<string> = [];
  if (schemaString && decodedData) {
    list = schemaString.split(',').map((type, index) => `${type} : ${decodedData[index] || EMPTY_STRING}`);
  }

  const handleCopy = () => {
    if (!list.length) return;
    const stringToCopy = JSON.stringify(list, null, '\t').replace(/,/g, ';').replace(/\[/g, '{').replace(/\]/g, '}');
    navigator.clipboard.writeText(stringToCopy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const Icon = copied ? Check : Copy;

  return (
    <div className="flex flex-col w-full max-w-[773px] min-h-[256px] items-start gap-6 p-6 bg-[#f4f4f8] rounded-xl">
      <div className="flex items-start justify-between w-full">
        <div className="w-fit font-semibold text-[#161517] text-xl tracking-[0]">Attestation Data</div>
        <Icon className="cursor-pointer hover:opacity-60" color={copied ? '#1a9d37' : '#64687D'} onClick={handleCopy} />
      </div>
      <div className="flex flex-col w-full max-w-[725px] h-[160px] items-start p-4 bg-[#fafafc] rounded-lg overflow-auto border border-solid border-[#c0cddd] text-[#6d6f73] text-sm scrollbar">
        {`{`}
        <div className="items-start flex flex-col ps-6">
          {list.map((item) => (
            <div key={item} className="whitespace-nowrap">
              {item}
            </div>
          ))}
        </div>
        {`}`}
      </div>
    </div>
  );
};
