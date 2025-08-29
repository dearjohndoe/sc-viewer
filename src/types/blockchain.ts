export interface ProviderInfo {
  cid: string;
  ratePerMB: number;
  maxSpan: number;
  lastProof: number;
  nextProofByte: string;
  nonce: string;
}

export interface ContractProviders {
  providers: ProviderInfo[];
  balance: string;
}

export interface ContractInfo {
  bagID: string;
  fileSize: string;
  chunkSize: number;
  owner: string;
  merkleHash: string;
}

export interface StorageContractFull {
  info: ContractInfo;
  providers: ContractProviders;
}
