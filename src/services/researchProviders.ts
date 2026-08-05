import type { ResearchProvider } from '../types/researchProvider';
import { ArxivResearchProvider, type ArxivProviderOptions } from './arxivResearchProvider';
import { LocalStorageResearchCache } from './researchCache';

export const createResearchProviders = (options: { arxiv?: ArxivProviderOptions } = {}): ResearchProvider[] => {
  const arxivOptions: ArxivProviderOptions = {
    cache: new LocalStorageResearchCache(),
    ...options.arxiv,
  };
  return [new ArxivResearchProvider(arxivOptions)];
};

export const getResearchProvider = (
  providers: ResearchProvider[],
  providerId: ResearchProvider['id']
) => providers.find((provider) => provider.id === providerId);
