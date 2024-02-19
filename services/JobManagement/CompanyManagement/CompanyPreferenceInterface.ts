import { CompanyDesireability } from "@prisma/client";

export interface CompanyPreferenceInterface {
  desireability?: CompanyDesireability;
  notes?: string;
}
