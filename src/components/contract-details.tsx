"use client";

import { StorageContractFull } from "@/types/blockchain";
import React, { useState } from "react";
import { ErrorComponent } from "./error";
import { RenderField } from "./render-field";
import { Copy, Info, ListMinus, Loader2 } from "lucide-react";
import { copyToClipboard, printSpace, shortenString } from "@/lib/utils";
import { fetchStorageContractFullInfo } from "@/lib/ton/storage-contracts";

interface ContractDetailsProps {
  contractAddress: string;
}

export function ContractDetails({ contractAddress }: ContractDetailsProps) {
  const [contractInfo, setContractInfo] = useState<StorageContractFull | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  React.useEffect(() => {
    if (contractAddress) {
      fetchContractInfo();
    }
  }, [contractAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchContractInfo = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    const info = await fetchStorageContractFullInfo(contractAddress);
    if (info instanceof Error) {
      setIsLoading(false);
      setError(info.message);
      return;
    }

    console.log("Fetched contract info:", info);
    setIsLoading(false);
    setContractInfo(info);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-gray-600">Loading contract information...</span>
        </div>
      </div>
    );
  }

  if (!contractInfo) {
    return (
      <div className="p-4">
        <span className="text-gray-500">Contract information is not available</span>
      </div>
    );
  }

  return (
    <div className="p-6 text-black space-y-6 max-h-[calc(90vh-16rem)]">
      {error && <ErrorComponent error={error} />}

      {/* Providers list */}
      <div>
        <div className="flex items-center mb-4 text-gray-700 font-semibold">
          <ListMinus className="w-5 h-5 mr-2" />
          Providers
        </div>

        {contractInfo.providers.providers.length === 0 ? (
          <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
            No providers found.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Public Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate per MB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Span
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Proof
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Proof Byte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nonce
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contractInfo.providers.providers.map((provider, index) => (
                  <tr key={provider.cid} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {shortenString(provider.cid, 15)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(provider.cid, setCopiedKey)}
                          className={`ml-2 transition-colors duration-200 ${copiedKey === provider.cid
                              ? "text-green-500"
                              : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {provider.ratePerMB}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {provider.maxSpan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {provider.lastProof ? new Date(provider.lastProof * 1000).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {provider.nextProofByte}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-sm font-medium text-gray-900">
                        {shortenString(provider.nonce, 12)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(provider.nonce, setCopiedKey)}
                        className={`ml-2 transition-colors duration-200 ${copiedKey === provider.nonce
                            ? "text-green-500"
                            : "text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Storage info */}
      <div>
        <div className="flex items-center mb-4 text-gray-700 font-semibold">
          <Info className="w-5 h-5 mr-2" />
          Storage
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <RenderField
            label="Bag ID"
            value={contractInfo.info.bagID}
            url={`https://mytonstorage.org/api/v1/gateway/${contractInfo.info.bagID}`}
            copy={contractInfo.info.bagID}
          />
          <RenderField
            label="Balance"
            value={`${(Number(contractInfo.providers.balance) / 1_000_000_000).toFixed(4)} TON`}
          />
          <RenderField
            label="File size"
            value={printSpace(Number(contractInfo.info.fileSize))}
          />
          <RenderField
            label="Chunk size"
            value={printSpace(contractInfo.info.chunkSize)}
          />
          <RenderField
            label="Owner"
            value={contractInfo.info.owner}
            url={`https://tonscan.org/address/${contractInfo.info.owner}`}
            copy={contractInfo.info.owner}
          />
          <RenderField
            label="Merkle Hash"
            value={contractInfo.info.merkleHash}
            copy={contractInfo.info.merkleHash}
          />
        </div>
      </div>
    </div>
  );
}
