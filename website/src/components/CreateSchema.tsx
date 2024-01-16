import { type FunctionComponent, useEffect, useState } from "react";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useAccount } from "wagmi";
import { Address } from "@wagmi/core";

export type SDKDemoProps = {
  veraxSdk: VeraxSdk;
  getTxHash: (hash: Address) => void;
  getSchemaId: (schemaId: Address) => void;
};

const SCHEMA = "(bool hasCompletedTutorial)";

const CreateSchema: FunctionComponent<SDKDemoProps> = ({ veraxSdk, getTxHash, getSchemaId }) => {
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [schemaId, setSchemaId] = useState<string>("");
  const [schemaExists, setSchemaExists] = useState<boolean>(false);

  const { isConnected } = useAccount();

  useEffect(() => {
    const fetchSchema = async () => {
      const schemaId = (await veraxSdk.schema.getIdFromSchemaString(SCHEMA)) as Address;
      const alreadyExists = (await veraxSdk.schema.getSchema(schemaId)) as boolean;
      setSchemaId(schemaId);
      setSchemaExists(alreadyExists);
      getSchemaId(schemaId);
    };

    fetchSchema();
  }, [getSchemaId, veraxSdk.schema]);

  useEffect(() => {}, [veraxSdk.schema]);

  const createSchema = async () => {
    try {
      const hash = await veraxSdk.schema.create(
        "Tutorial Schema",
        "This Schema is used for the tutorial",
        "https://ver.ax/#/tutorials",
        SCHEMA,
      );
      setTxHash(hash);
      getTxHash(hash);
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        setError(`Oops, something went wrong: ${e.message}`);
      }
    }
  };

  return (
    <>
      <button onClick={createSchema} disabled={!isConnected || schemaExists}>
        Send transaction
      </button>
      {schemaExists && <p>{`Schema already exists, with ID ${schemaId} !`}</p>}
      {txHash !== "" && <p>{`Transaction with hash ${txHash} sent!`}</p>}
      {error !== "" && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default CreateSchema;
