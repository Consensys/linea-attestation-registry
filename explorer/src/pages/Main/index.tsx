import { Attestation } from "@verax-attestation-registry/verax-sdk";
import { useEffect, useState } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import "./styles.css";
import { useNetworkContext } from "@/providers/network-provider/context";

export const Main = () => {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const { sdk } = useNetworkContext();

  useEffect(() => {
    const getAttestations = async () => {
      const attestations = await sdk.attestation.findBy(10);
      setAttestations(attestations);
    };
    getAttestations();
  }, [sdk]);
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Portal</TableHead>
            <TableHead>Attestation ID</TableHead>
            <TableHead>Schema</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Issued</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attestations.map((attestation) => (
            <TableRow key={attestation.id}>
              <TableCell>{attestation.portal}</TableCell>
              <TableCell>{attestation.id}</TableCell>
              <TableCell>{attestation.schemaString}</TableCell>
              <TableCell>{attestation.subject}</TableCell>
              <TableCell>{attestation.attestedDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
