import useSWR from 'swr';
import { Attestation, Schema } from '@verax-attestation-registry/verax-sdk/lib/types/.graphclient';
import { Link } from 'react-router-dom';

import { toModuleById, toSchemaById } from '@/routes/constants';
import { SWRKeys } from '@/interfaces/swr/enum';
import { useNetworkContext } from '@/providers/network-provider';

const SchemaCard: React.FC<{ schemaId: string }> = ({ schemaId }) => {
  const { sdk } = useNetworkContext();

  const { data: schema, isLoading } = useSWR(
    SWRKeys.GET_SCHEMA_BY_ID,
    () => sdk.schema.findOneById(schemaId) as Promise<Schema>
  );
  //todo add loading
  if (isLoading) return <p>Loading schema...</p>;
  //todo add not found
  if (!schema) return null;

  return (
    <div className="flex flex-col w-full max-w-[475px] gap-1 p-[1.3125rem] rounded-[0.375rem] border border-solid border-[#c5c5cc] items-start">
      <div className="flex flex-col gap-4 self-stretch w-full items-start">
        <div className="flex justify-between self-stretch w-full items-start">
          <div className="w-fit font-normal text-[#606476] text-sm">Schema</div>
          <Link to={toSchemaById(schemaId)} className="w-fit font-normal text-[#161517] text-sm tracking-[0] underline">
            View Details
          </Link>
        </div>
        <div className="inline-flex flex-col items-start gap-2">
          <div className="w-fit font-semibold text-[#161517] text-xl self-stretch overflow-hidden text-ellipsis">
            {schema.name}
          </div>
          <p className="w-fit font-normal text-[#606476] text-sm self-stretch">{schema.description}</p>
        </div>
        <div className="font-medium text-[#161517] text-sm self-stretch overflow-hidden text-ellipsis">{schema.id}</div>
      </div>
    </div>
  );
};

export const AttestationInfo: React.FC<Attestation> = ({ ...attestation }) => {
  const list = [
    {
      title: 'ISSUED BY',
      value: attestation.attester,
    },
    {
      title: 'PORTAL',
      value: attestation.portal,
      get link() {
        return toModuleById(this.value);
      },
    },
    {
      title: 'SUBJECT',
      value: attestation.subject,
    },
  ];

  return (
    <div className="inline-flex flex-col min-h-[477px] h-full items-start gap-8 p-6 bg-[#f4f4f8] rounded-xl">
      <div className="inline-flex flex-col gap-6 items-start max-w-[475px]">
        {list.map((item) => (
          <div key={item.title} className="inline-flex flex-col items-start gap-2 w-full overflow-hidden">
            <div className="w-fit font-normal text-[#676767] text-xs">{item.title.toUpperCase()}</div>
            {item.link ? (
              <Link
                to={item.link}
                className="w-full font-medium text-[#161517] text-base whitespace-nowrap self-stretch overflow-hidden text-ellipsis cursor-pointer hover:underline"
              >
                {item.value}
              </Link>
            ) : (
              <div
                className={`w-full font-medium text-[#161517] text-base whitespace-nowrap self-stretch overflow-hidden text-ellipsis`}
              >
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
      <SchemaCard schemaId={attestation.schemaId} />
    </div>
  );
};
