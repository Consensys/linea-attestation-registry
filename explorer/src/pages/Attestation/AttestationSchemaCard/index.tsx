import useSWR from 'swr';
import { Schema } from '@verax-attestation-registry/verax-sdk/lib/types/.graphclient';
import { Link } from 'react-router-dom';

import ArrowRight from '@/assets/icons/arrow-right.svg';
import { toSchemaById } from '@/routes/constants';
import { SWRKeys } from '@/interfaces/swr/enum';
import { useNetworkContext } from '@/providers/network-provider';
import { cropString } from '@/utils/stringUtils';
import { HelperIndicator } from '@/components/HelperIndicator';

export const AttestationSchemaCard: React.FC<{ schemaId: string }> = ({ schemaId }) => {
  const { sdk } = useNetworkContext();

  const { data: schema, isLoading } = useSWR(
    SWRKeys.GET_SCHEMA_BY_ID,
    () => sdk.schema.findOneById(schemaId) as Promise<Schema>,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );
  //todo add loading
  if (isLoading) return <p>Loading schema...</p>;
  //todo add not found
  if (!schema) return null;

  return (
    <div className="w-full flex-col justify-start items-start gap-4 inline-flex">
      <header className="justify-start items-center gap-2 inline-flex">
        <HelperIndicator type="schema" />
        <div className="text-text-primary text-base font-semibold">Schema</div>
      </header>
      <div className="w-full flex-col justify-start items-start gap-3 flex">
        <div className="w-full justify-between items-start inline-flex text-text-secondary text-base font-medium">
          <div>{schema.name}</div>
          <div>{cropString(schema.id)}</div>
        </div>
        <div className="text-text-tertiary text-sm font-normal leading-tight">{schema.description}</div>
      </div>
      <Link to={toSchemaById(schemaId)} className="flex gap-2 text-text-primary text-sm font-semibold">
        View Details
        <img src={ArrowRight} alt="arrow-right" />
      </Link>
    </div>
  );
};
