"use client";

import { ContractDetails } from "@/components/contract-details";
import { Search, FileText } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [contractAddress, setContractAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contractAddress.trim()) {
      setCurrentAddress(contractAddress.trim());
    }
  };

  const handleClear = () => {
    setContractAddress("");
    setCurrentAddress("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                TON Storage Contract Viewer
              </h2>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contract-address" className="block text-sm font-medium text-gray-700 mb-2">
                Contract Address
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    id="contract-address"
                    type="text"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    placeholder="Enter TON Storage contract address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!contractAddress.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Load Contract
                </button>
                {currentAddress && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        {currentAddress && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Contract Details</h2>
              <p className="text-sm text-gray-600 mt-1 break-all">Address: {currentAddress}</p>
            </div>
            <ContractDetails contractAddress={currentAddress} />
          </div>
        )}
      </main>
    </div>
  );
}
