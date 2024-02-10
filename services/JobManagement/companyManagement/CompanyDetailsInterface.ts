import { CompanySize, CompanyType } from "@prisma/client";

export interface CompanyDetailsInterface {
  culture?: string;
  industry?: string;
  size?: CompanySize;
  website?: string;
  type?: CompanyType;
  history?: string;
  mission?: string;
  vision?: string;
  values?: string;
  description?: string;
}
