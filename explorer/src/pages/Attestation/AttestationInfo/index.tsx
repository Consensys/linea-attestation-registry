import { toModuleById, toSchemaById } from '@/routes/constants';
import { Attestation, Schema } from '@verax-attestation-registry/verax-sdk/lib/types/.graphclient';
import { Link, useNavigate } from 'react-router-dom';
import { SWRKeys } from '@/interfaces/swr/enum';
import { useNetworkContext } from '@/providers/network-provider';
import useSWR from 'swr';

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
    <div className="flex flex-col w-full max-w-[475px] gap-[5px] p-[21px] rounded-[6px] border border-solid border-[#c5c5cc] items-start">
      <div className="flex flex-col gap-[16px] self-stretch w-full items-start">
        <div className="flex justify-between self-stretch w-full items-start">
          <div className="w-fit font-normal text-[#606476] text-sm">Schema</div>
          <Link to={toSchemaById(schemaId)} className="w-fit font-normal text-[#161517] text-sm tracking-[0] underline">
            View Details
          </Link>
        </div>
        <div className="inline-flex flex-col items-start gap-[8px]">
          <div className="w-fit font-semibold text-[#161517] text-[20px] self-stretch overflow-hidden text-ellipsis">
            {schema.name}
          </div>
          <p className="w-fit font-normal text-[#606476] text-sm self-stretch overflow-hidden text-ellipsis">
            {schema.description}
          </p>
        </div>
        <div className="font-medium text-[#161517] text-sm self-stretch overflow-hidden text-ellipsis">{schema.id}</div>
      </div>
    </div>
  );
};

export const AttestationInfo: React.FC<Attestation> = ({ ...attestation }) => {
  const navigate = useNavigate();
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
    <div className="inline-flex flex-col h-[477px] items-start gap-[32px] p-[24px] relative bg-[#f4f4f8] rounded-[12px]">
      <div className="inline-flex flex-col gap-[24px] items-start relative flex-[0_0_auto]">
        {list.map((item) => (
          <div key={item.title} className="inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#676767] text-[12px] tracking-[0]">
              {item.title.toUpperCase()}
            </div>
            <div
              className={`relative w-fit [font-family:'Inter-Medium',Helvetica] font-medium text-[#161517] text-[16px] tracking-[0] whitespace-nowrap ${
                item.link ? 'cursor-pointer hover:underline' : ''
              }`}
              onClick={() => item.link && navigate(item.link)}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
      <SchemaCard schemaId={attestation.schemaId} />
    </div>
  );
};
