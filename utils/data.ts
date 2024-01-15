import { AddressInterface } from "./databaseTypes";
import { Address } from "@prisma/client";

export const areAddressessIdentical = (
  address1?: AddressInterface | Address | null,
  address2?: AddressInterface | Address | null
) => {
  if (!address1 || !address2) return false;

  return (
    address1.streetAddress === address2.streetAddress &&
    address1.streetAddress2 === address2.streetAddress2 &&
    address1.city === address2.city &&
    address1.state === address2.state &&
    address1.country === address2.country &&
    address1.postalCode === address2.postalCode
  );
};
