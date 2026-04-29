export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'suits' | 'shirts' | 'accessories' | 'shoes';
  images: string[];
  sizes: string[];
  colors: string[];
  features?: string[];
  stock: number;
  createdAt: number;
  updatedAt: number;
}

export type OperationType = 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
