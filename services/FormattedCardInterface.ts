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

/**
 {
      applicationId: card.id,
      companyName: job.company.name,
      title: job.title,
      workMode: job.workMode,
      payAmount: compensation.payAmount,
      payFrequency: compensation.payFrequency,
      currency: compensation.currency,
      city: lastAddress.city,
      country: lastAddress.country,
      applicationLink: card.applicationLink,
      applicationDate: prettifyDate(card.applicationDate),
      status: card.status,
    };
 */

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
