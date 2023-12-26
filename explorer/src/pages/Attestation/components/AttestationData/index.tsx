import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { t } from "i18next";
import { Check, Copy, EyeOffIcon, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactJson from "react-json-view";
import { useTernaryDarkMode } from "usehooks-ts";

import { HelperIndicator } from "@/components/HelperIndicator";
import { EMPTY_STRING, THOUSAND } from "@/constants";
import useWindowDimensions from "@/hooks/useWindowDimensions";

import { getAttestationData, isDecodedData } from "./utils";

export const AttestationData: React.FC<Attestation> = ({ ...attestation }) => {
  const screen = useWindowDimensions();
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [heightDifference, setHeightDifference] = useState<number>(0);
  const { isDarkMode } = useTernaryDarkMode();

  const { decodedData, decodedPayload } = attestation;
  const data = isDecodedData(decodedPayload, decodedData) ? getAttestationData(decodedPayload ?? decodedData) : null;

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
        title: t("common.actions.less"),
        Icon: Minus,
      }
    : {
        title: t("common.actions.more"),
        Icon: Plus,
      };
  const toggleButtonSize = screen.sm ? 24 : 16;

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
          <div className="text-text-primary dark:text-whiteDefault text-base font-semibold">
            {t("attestation.data")}
          </div>
        </div>
        <CopyToClipboard onCopy={handleCopy} text={data ? JSON.stringify(data, null, 2) : EMPTY_STRING}>
          <Icon
            className={`w-[21px] h-[21px] cursor-pointer hover:opacity-60 ${
              copied ? "text-greenDefault dark:text-greenDark" : "text-greyDefault dark:text-text-secondaryDark"
            }`}
          />
        </CopyToClipboard>
      </div>
      <div className="bg-surface-attestationData dark:bg-surface-attestationDataDark rounded-xl p-4 pe-3 pb-2 w-full relative">
        {!data ? (
          <div className="flex gap-2 text-base text-text-tertiary dark:text-tertiary w-full justify-center h-[108px] items-center">
            <EyeOffIcon />
            {t("common.messages.notDecoded")}
          </div>
        ) : (
          <div
            ref={ref}
            className={`flex flex-col pe-1 items-start overflow-auto text-text-tertiary dark:text-tertiary text-sm scrollbar transition-[height] ${
              screen.sm ? "no-vertical-scrollbar" : EMPTY_STRING
            }`}
            style={{ height: isOpened ? heightDifference + 108 : 108 }}
          >
            <ReactJson
              src={JSON.parse(data)}
              name={false}
              displayDataTypes={false}
              collapsed={false}
              enableClipboard={false}
              quotesOnKeys={false}
              sortKeys={true}
              theme={isDarkMode ? "hopscotch" : "rjv-default"}
              style={{ backgroundColor: isDarkMode ? "#12172C" : "#EAEAF3" }}
            />
          </div>
        )}
        {heightDifference !== 0 && (
          <div
            className={`absolute cursor-pointer flex gap-1 items-center text-text-quaternary text-sm font-semibold ${
              screen.sm ? "right-2 bottom-6" : "right-6 bottom-2"
            }`}
            onClick={() => setIsOpened((prev) => !prev)}
          >
            {!screen.sm && toggleButton.title}
            <toggleButton.Icon
              className="bg-surface-darkGrey dark:bg-surface-darkGreyDark rounded-full"
              width={toggleButtonSize}
              height={toggleButtonSize}
            />
          </div>
        )}
      </div>
    </div>
  );
};
