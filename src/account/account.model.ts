export interface CreateAccountRequest {
  userName: string;
  accountNumber: string;
  emailAddress: string;
  identityNumber: string;
}

export interface AccountResponse {
  id: string;
  userName: string;
  accountNumber: string;
  emailAddress: string;
  identityNumber: string;
}

export interface UpdateAccountRequest {
  id: string;
  userName?: string;
  accountNumber?: string;
  emailAddress?: string;
  identityNumber?: string;
}

export interface DeleteAccountRequest {
  id: string;
}

export interface GetAccountRequest {
  id: string;
}

export interface SearchAccountRequest {
  userName?: string;
  identityNumber?: string;
  accountNumber?: string;
  emailAddress?: string;
  page: number;
  size: number;
}
