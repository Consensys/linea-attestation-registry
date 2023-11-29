import { useEffect, useRef, useState } from 'react';
import { Attestation } from '@verax-attestation-registry/verax-sdk/lib/types/.graphclient';
import { Check, Copy, MinusCircle, PlusCircle } from 'lucide-react';
import ReactJson from 'react-json-view';
import { EyeOffIcon } from 'lucide-react';

import { getAttestationData } from './utils';
import { HelperIndicator } from '@/components/HelperIndicator';

export const AttestationData: React.FC<Attestation> = ({ ...attestation }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [heightDifference, setHeightDifference] = useState<number>(0);

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

  const toggleButton = isOpened
    ? {
        title: 'View Less',
        Icon: MinusCircle,
      }
    : {
        title: 'View More',
        Icon: PlusCircle,
      };

  useEffect(() => {
    if (!heightDifference && ref.current && ref.current.scrollHeight > ref.current.clientHeight) {
      setHeightDifference(ref.current.scrollHeight - ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <div className="w-full flex-col justify-start items-start gap-4 inline-flex">
      <div className="self-stretch justify-between items-center inline-flex">
        <div className="h-[19px] justify-start items-center gap-2 flex">
          <HelperIndicator type="attestation" />
          <div className="text-zinc-950 text-base font-semibold">Attestation Data</div>
        </div>
        <Icon
          className="w-[21px] h-[21px] cursor-pointer hover:opacity-60"
          color={copied ? '#1a9d37' : '#64687D'}
          onClick={handleCopy}
        />
      </div>
      <div className="bg-[#F4F5F9] rounded-xl p-4 pe-3 w-full relative">
        {!data ? (
          <div className="flex gap-2 text-base text-[#6d6f73] w-full justify-center h-[183px] items-center">
            <EyeOffIcon />
            Empty
          </div>
        ) : (
          <div
            ref={ref}
            className="flex flex-col pe-1 items-start overflow-auto text-[#6d6f73] text-sm scrollbar transition-[height]"
            style={{ height: isOpened ? heightDifference + 183 : 183 }}
          >
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
        {heightDifference !== 0 && (
          <div
            className="absolute cursor-pointer right-6 bottom-2 flex gap-1 items-center text-slate-400 text-sm font-semibold"
            onClick={() => setIsOpened((prev) => !prev)}
          >
            {toggleButton.title}
            <toggleButton.Icon width={16} height={16} />
          </div>
        )}
      </div>
    </div>
  );
};
