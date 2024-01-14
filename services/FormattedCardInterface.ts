export interface IndividualFormattedCardInterface {
  applicationId: number;
  groupId: number;
  jobId: number;
  company: {
    companyId: number;
    name: string;
  };
  jobTitle: string;
  jobDescription: string;
  workMode: string;
  payAmount: number;
  payFrequency: string;
  currency: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  applicationLink: string;
  applicationDate: Date;
  status: string;
  positionIndex: number;
  notes: string;
}

export interface FormattedCardForBoardInterface {
  applicationId: number;
  companyName: string;
  title: string;
  workMode: string;
  payAmount: number;
  payFrequency: string;
  currency: string;
  city: string;
  country: string;
  applicationLink: string;
  applicationDate: string;
  status: string;
}
