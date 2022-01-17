export interface IndexerStatus {
    network: string;
    url: string;
    inSync: boolean;
    hydraVersion: string;
    chainHeight: number;
    lastComplete: number;
    maxComplete: number;
}