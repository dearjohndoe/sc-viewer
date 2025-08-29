/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContractInfo, ContractProviders, ProviderInfo, StorageContractFull } from "@/types/blockchain";
import { Address, TonClient, TupleReader } from "@ton/ton";

const requestCache = new Map<string, Promise<StorageContractFull | Error>>();
const CACHE_TTL = 30000;

export async function fetchStorageContractFullInfo(userAddr: string): Promise<StorageContractFull | Error> {
  const cacheKey = `full-${userAddr}`;

  if (requestCache.has(cacheKey)) {
    console.log(`Using cached request for ${userAddr}`);
    return requestCache.get(cacheKey)!;
  }

  const requestPromise = (async () => {
    try {
      const info = await fetchStorageInfo(userAddr);
      if (info instanceof Error) {
        return info;
      }

      const providers = await fetchProviders(userAddr);
      if (providers instanceof Error) {
        return providers;
      }

      return {
        info: info,
        providers: providers
      };
    } finally {
      setTimeout(() => {
        requestCache.delete(cacheKey);
      }, CACHE_TTL);
    }
  })();

  requestCache.set(cacheKey, requestPromise);

  return requestPromise;
}

async function fetchProviders(userAddr: string): Promise<ContractProviders | Error> {
  await new Promise(resolve => setTimeout(resolve, 1300));

  const info: ContractProviders = {
    providers: [],
    balance: "0"
  };

  try {
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const address = Address.parse(userAddr);

    const storageInfo: {
      gas_used: number;
      stack: TupleReader;
    } = await client.runMethod(address, "get_providers");

    if (!storageInfo) {
      return new Error('Failed to fetch storage info');
    }

    console.info("Gas used:", storageInfo.gas_used);
    console.info("Stack:", storageInfo.stack);

    const p = storageInfo.stack.pop();
    if (p.type === 'tuple') {
      const prs = p.items;
      let pr: unknown;
      while (pr = prs.pop()) {
        console.info("Provider:", pr);
        const provider: ProviderInfo = {
          cid: '',
          ratePerMB: 0,
          maxSpan: 0,
          lastProof: 0,
          nextProofByte: "0",
          nonce: "0"
        };

        const nonce = (pr as any).pop(); // nonce
        console.info("nonce:", nonce);
        provider.nonce = (nonce as bigint).toString();

        const nextProofByte = (pr as any).pop(); // nextProofByte
        console.info("nextProofByte:", nextProofByte);
        provider.nextProofByte = (nextProofByte as bigint).toString();

        const lastProof = (pr as any).pop(); // lastProof
        console.info("lastProof:", lastProof);
        provider.lastProof = Number(lastProof as bigint);

        const maxSpan = (pr as any).pop(); // maxSpan
        console.info("maxSpan:", maxSpan);
        provider.maxSpan = Number(maxSpan as bigint);

        const ratePerMB = (pr as any).pop(); // ratePerMB
        provider.ratePerMB = Number(ratePerMB);

        const cid = (pr as any).pop(); // cid
        provider.cid = (cid as bigint).toString(16).padStart(64, '0').toUpperCase();

        info.providers.push(provider);
      }
    }

    const balance = storageInfo.stack.pop();
    if (balance.type === 'int') {
      info.balance = balance.value.toString();
    }

  } catch (err) {
    console.error(err);
    return new Error('Failed to fetch transactions');
  }

  return info;
}

async function fetchStorageInfo(userAddr: string): Promise<ContractInfo | Error> {
  await new Promise(resolve => setTimeout(resolve, 1300));

  let info: ContractInfo = {
    bagID: '',
    fileSize: "0",
    chunkSize: 0,
    owner: '',
    merkleHash: ''
  };

  try {
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const address = Address.parse(userAddr);

    const storageInfo: {
      gas_used: number;
      stack: TupleReader;
    } = await client.runMethod(address, "get_storage_info");

    if (!storageInfo) {
      return new Error('Failed to fetch storage info');
    }

    console.info("Gas used:", storageInfo.gas_used);
    console.info("Stack:", storageInfo.stack);

    let bagID = storageInfo.stack.pop();
    if (bagID.type === 'int') {
      info.bagID = bagID.value.toString(16).padStart(64, '0').toUpperCase();
    }

    let fileSize = storageInfo.stack.pop();
    if (fileSize.type === 'int') {
      info.fileSize = fileSize.value.toString();
    }

    let chunkSize = storageInfo.stack.pop();
    if (chunkSize.type === 'int') {
      info.chunkSize = Number(chunkSize.value);
    }

    let addrCell = storageInfo.stack.pop()
    if (addrCell.type === 'cell') {
      let sc = addrCell.cell.beginParse();
      if (sc.remainingBits >= 256) {
        const owner = sc.loadAddress();
        info.owner = owner.toString({ testOnly: false });
        console.info("Loaded owner:", info.owner);
      }
    }

    let merkleHash = storageInfo.stack.pop();
    if (merkleHash.type === 'int') {
      info.merkleHash = merkleHash.value.toString(16).padStart(64, '0');
    }
  } catch (err) {
    console.error(err);
    return new Error('Failed to fetch transactions');
  }

  return info;
}
