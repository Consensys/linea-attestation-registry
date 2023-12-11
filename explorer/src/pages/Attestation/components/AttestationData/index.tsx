import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { Check, Copy, EyeOffIcon, MinusCircle, PlusCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactJson from "react-json-view";

import { HelperIndicator } from "@/components/HelperIndicator";
import { EMPTY_STRING, THOUSAND } from "@/constants";
import useWindowDimensions from "@/hooks/useWindowDimensions";

import { getAttestationData } from "./utils";

export const AttestationData: React.FC<Attestation> = ({ ...attestation }) => {
  const screen = useWindowDimensions();
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [heightDifference, setHeightDifference] = useState<number>(0);

  const { schemaString, decodedData } = attestation;
  const data = schemaString && decodedData ? getAttestationData(schemaString, decodedData) : null;

  const handleCopy = (text: string, result: boolean) => {
    if (!result || !text) return;
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, THOUSAND);
  };
  const Icon = copied ? Check : Copy;

  const toggleButton = isOpened
    ? {
        title: "View Less",
        Icon: MinusCircle,
      }
    : {
        title: "View More",
        Icon: PlusCircle,
      };

  useEffect(() => {
    if (!heightDifference && ref.current && ref.current.scrollHeight > ref.current.clientHeight) {
      setHeightDifference(ref.current.scrollHeight - ref.current.clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return (
    <div className="w-full flex-col justify-start items-start gap-4 inline-flex">
      <div className="self-stretch justify-between items-center inline-flex">
        <div className="h-[19px] justify-start items-center gap-2 flex">
          <HelperIndicator type="attestation" />
          <div className="text-text-primary text-base font-semibold">Attestation Data</div>
        </div>
        <CopyToClipboard onCopy={handleCopy} text={data ? JSON.stringify(data, null, 2) : EMPTY_STRING}>
          <Icon className="w-[21px] h-[21px] cursor-pointer hover:opacity-60" color={copied ? "#1a9d37" : "#64687D"} />
        </CopyToClipboard>
      </div>
      <div className="bg-surface-attestationData rounded-xl p-4 pe-3 w-full relative">
        {!data ? (
          <div className="flex gap-2 text-base text-text-tertiary w-full justify-center h-[108px] items-center">
            <EyeOffIcon />
            Empty
          </div>
        ) : (
          <div
            ref={ref}
            className="flex flex-col pe-1 items-start overflow-auto text-text-tertiary text-sm scrollbar transition-[height]"
            style={{ height: isOpened ? heightDifference + 108 : 108 }}
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
            className="absolute cursor-pointer right-6 bottom-2 flex gap-1 items-center text-text-quaternary text-sm font-semibold"
            onClick={() => setIsOpened((prev) => !prev)}
          >
            {(screen.md || screen.lg || screen.xl) && toggleButton.title}
            <toggleButton.Icon width={16} height={16} />
          </div>
        )}
      </div>
    </div>
  );
};
