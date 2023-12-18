## CLI examples

<details>
  <summary>Portal examples</summary>

    ```shell
    pnpm portal findonebyid '0x34798a866f52949208e67fb57ad36244024c50c0'

    pnpm portal findby '{\"ownerName\": \"Tester\"}'
    pnpm portal simulateattest '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationPayload\" : { \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}, \"validationPayloads\": []}'

    pnpm portal attest '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationPayload\" : { \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}, \"validationPayloads\": []}'

    pnpm portal simulateBulkAttest '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationPayloads\" : [{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]},{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}], \"validationPayloads\": [[],[]]}'

    pnpm portal bulkAttest '{\"portalAddress\": \"0xBA5bBAe01509311f61Bac8A15dCB4B41bEd8Ecb5\", \"attestationPayloads\" : [{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]},{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}], \"validationPayloads\": [[],[]]}'

    pnpm portal simulaterevoke '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationId\" : \"0x00000000000000000000000000000000000000000000000000000000000010a8\" }'

    pnpm portal revoke '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationId\" : \"0x00000000000000000000000000000000000000000000000000000000000010a8\" }'

    pnpm portal simulateBulkRevoke '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationIds\" : [\"0x00000000000000000000000000000000000000000000000000000000000010a7\", \"0x00000000000000000000000000000000000000000000000000000000000010a6\"] }'

    pnpm portal bulkRevoke '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationIds\" : [\"0x00000000000000000000000000000000000000000000000000000000000010a7\", \"0x00000000000000000000000000000000000000000000000000000000000010a6\"] }'

    pnpm portal simulateReplace '{\"portalAddress\": \"0xBA5bBAe01509311f61Bac8A15dCB4B41bEd8Ecb5\", \"attestationId\": \"0x0000000000000000000000000000000000000000000000000000000000000006\", \"attestationPayload\" : { \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}, \"validationPayloads\": []}'

    pnpm portal replace '{\"portalAddress\": \"0xBA5bBAe01509311f61Bac8A15dCB4B41bEd8Ecb5\", \"attestationId\": \"0x0000000000000000000000000000000000000000000000000000000000000006\", \"attestationPayload\" : { \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}, \"validationPayloads\": []}'

    pnpm portal simulateBulkReplace '{\"portalAddress\": \"0xBA5bBAe01509311f61Bac8A15dCB4B41bEd8Ecb5\", \"attestationIds\" : [\"0x0000000000000000000000000000000000000000000000000000000000000007\", \"0x0000000000000000000000000000000000000000000000000000000000000008\"], \"attestationPayloads\" : [{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]},{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}], \"validationPayloads\": [[],[]]}'

    pnpm portal bulkReplace '{\"portalAddress\": \"0xBA5bBAe01509311f61Bac8A15dCB4B41bEd8Ecb5\", \"attestationIds\" : [\"0x0000000000000000000000000000000000000000000000000000000000000007\", \"0x0000000000000000000000000000000000000000000000000000000000000008\"], \"attestationPayloads\" : [{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]},{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}], \"validationPayloads\": [[],[]]}'

    pnpm portal simulateRegister '{\"id\":\"0xD39c439cD3Ae5E1F3c7d13985aDAC90846284904\",\"name\":\"test\",\"description\":\"example\",\"isRevocable\":true,\"ownerName\":\"test\"}'

    pnpm portal register '{\"id\":\"0xD39c439cD3Ae5E1F3c7d13985aDAC90846284904\",\"name\":\"test\",\"description\":\"example\",\"isRevocable\":true,\"ownerName\":\"test\"}'

    pnpm portal simulateDeployDefaultPortal '{\"modules\":[],\"name\":\"test\",\"description\":\"example\",\"isRevocable\":true,\"ownerName\":\"test\"}'

    pnpm portal deployDefaultPortal '{\"modules\":[],\"name\":\"test\",\"description\":\"example\",\"isRevocable\":true,\"ownerName\":\"test\"}'

    pnpm portal getPortalByAddress '{\"portalAddress\":\"0x8b833796869b5debb9b06370d6d47016f0d7973b\"}'

    pnpm portal isPortalRegistered '{\"portalAddress\":\"0x8b833796869b5debb9b06370d6d47016f0d7973b\"}'

    pnpm portal getPortalsCount
    ```

</details>

<details>
  <summary>Attestation examples</summary>

    ```shell
    pnpm attestation findonebyid "0x000000000000000000000000000000000000000000000000000000000000109b"

    pnpm attestation findby '{\"portal\": \"0x34798a866f52949208e67fb57ad36244024c50c0\"}'

    pnpm attestation getRelatedAttestations "0x0000000000000000000000000000000000000000000000000000000000000001"

    pnpm attestation simulateUpdateRouter "0xC825ACA6621597bcb86438346A2538fba85380d9"

    pnpm attestation updateRouter "0xC825ACA6621597bcb86438346A2538fba85380d9"

    pnpm attestation simulateMassImport '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationPayloads\" : [{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]},{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}]}'

    pnpm attestation massImport '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationPayloads\" : [{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]},{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}]}'

    pnpm attestation simulateIncrementVersionNumber

    pnpm attestation incrementVersionNumber

    pnpm attestation isRegistered "0x0000000000000000000000000000000000000000000000000000000000000001"

    pnpm attestation isRevocable "0xBA5bBAe01509311f61Bac8A15dCB4B41bEd8Ecb5"

    pnpm attestation getAttestation "0x0000000000000000000000000000000000000000000000000000000000000001"

    pnpm attestation getAttestationWithDecodeObject "0x000000000000000000000000000000000000000000000000000000000000121f"

    pnpm attestation getVersionNumber

    pnpm attestation getAttestationIdCounter

    pnpm attestation balanceof '{\"account\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"id\": 1}'

    pnpm attestation balanceOfBatch '{\"accounts\": [\"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\"], \"ids\": [0, 1]}'
    ```

</details>

<details>
  <summary>Module examples</summary>

    ```shell
    pnpm module findonebyid "0x4bb8769e18f1518c35be8405d43d7cc07ecf501c"

    pnpm module findby '{\"name\": \"Msg Sender Module\"}'

    pnpm module simulateUpdateRouter "0x980978299e23B8F9B4D11542A83D92C83e781cb6"

    pnpm module updateRouter "0x980978299e23B8F9B4D11542A83D92C83e781cb6"

    pnpm module simulateRegister '{\"name\": \"sampleModule\", \"description\": \"Example module\", \"moduleAddress\": \"0x4bb8769e18f1518c35be8405d43d7cc07ecf501c\"}'

    pnpm module register '{\"name\": \"sampleModule\", \"description\": \"Example module\", \"moduleAddress\": \"0x4bb8769e18f1518c35be8405d43d7cc07ecf501c\"}'

    pnpm module simulateRunModules '{\"modulesAddresses\": [\"0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5\"], \"attestationPayload\" : { \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}, \"validationPayloads\":  [\"\"], \"value\": 1}'

    pnpm module runModules '{\"modulesAddresses\": [\"0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5\"], \"attestationPayload\" : { \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}, \"validationPayloads\":  [\"\"], \"value\": 1}'

    pnpm module simulateBulkRunModules '{\"modulesAddresses\": [\"0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5\"], \"attestationPayloads\" : [{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]},{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}], \"validationPayloads\":  [[\"\"], [\"\"]]}'

    pnpm module bulkRunModules '{\"modulesAddresses\": [\"0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5\"], \"attestationPayloads\" : [{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]},{ \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": 1693583329, \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": true }]}], \"validationPayloads\":  [[\"\"], [\"\"]]}'

    pnpm module isContractAddress "0x4bb8769e18f1518c35be8405d43d7cc07ecf501c"

    pnpm module getModulesNumber

    pnpm module isRegistered "0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5"

    pnpm module getModuleAddress 0

    pnpm module getModule "0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5"
    ```

</details>

<details>
  <summary>Schema examples</summary>

    ```shell
    pnpm schema findonebyid "0xce2647ed39aa89e6d1528a56deb6c30667ed2aae1ec2378ec3140c0c5d98a61e"

    pnpm schema findby '{\"description\": \"Gitcoin Passport Score\"}'

    pnpm schema simulateUpdateRouter "0x980978299e23B8F9B4D11542A83D92C83e781cb6"

    pnpm schema updateRouter "0x980978299e23B8F9B4D11542A83D92C83e781cb6"

    pnpm schema simulateCreate '{\"name\": \"sampleSchema\", \"description\": \"Example schema\", \"context\": \"Created by example\", \"schemaString\": \"bool isExample\"}'

    pnpm schema create '{\"name\": \"sampleSchema\", \"description\": \"Example schema\", \"context\": \"Created by example\", \"schemaString\": \"bool isExample\"}'

    pnpm schema simulateUpdateContext '{\"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"context\": \"New context\"}'

    pnpm schema updateContext '{\"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"context\": \"New context\"}'

    pnpm schema getIdFromSchemaString 'bool isExample'

    pnpm schema getSchema "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738"

    pnpm schema getSchemasNumber

    pnpm schema isRegistered "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738"

    pnpm schema getSchemaIds 0
    ```

</details>
