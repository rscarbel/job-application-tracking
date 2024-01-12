import prisma from "@/services/globalPrismaClient";
import { findOrCreateCompany } from "@/services/companyService";
import { createOrUpdateJob } from "@/services/jobService";
import { incrementCardsAfterIndex } from "@/services/applicationService";
import { reportError } from "@/app/api/reportError/reportError";
import { getRequestUser } from "@/services/userService";
import { getToken } from "next-auth/jwt";
import { CreateCardRequest } from "./interface";
import serverErrorResponse from "@/app/api/serverErrorResponse";

export async function POST(request) {
  const requestData = await request.json();
  const createCardRequest: CreateCardRequest = requestData;
  const {
    applicationDate,
    applicationLink,
    city,
    company,
    country,
    currency,
    desireability,
    groupId,
    jobDescription,
    jobTitle,
    notes,
    payAmount,
    payFrequency,
    positionIndex,
    postalCode,
    state,
    status,
    streetAddress,
    streetAddress2,
    workMode,
  } = createCardRequest;

  const token = await getToken({ req: request });
  const { sub, provider } = token || { sub: null, provider: null };

  if (typeof sub != "string" || typeof provider != "string")
    return new Response(
      JSON.stringify({
        error: "You must login before creating a new application",
      }),
      { status: 403 }
    );

  try {
    await prisma.$transaction(async (client) => {
      const user = await getRequestUser({ sub, provider });

      const addressProperties = {
        streetAddress,
        streetAddress2,
        city,
        state,
        postalCode,
        country,
      };

      const companyDetailsProperties = {
        culture: undefined,
        industry: undefined,
        size: undefined,
        website: undefined,
        type: undefined,
        history: undefined,
        mission: undefined,
        vision: undefined,
        values: undefined,
        description: undefined,
      };

      const companyPreferencesProperties = {
        desireability,
        notes: undefined,
      };

      const applicationGroup = await client.applicationGroup.findFirst({
        where: {
          id: groupId,
          userId: user.id,
        },
      });

      const newCompany = await findOrCreateCompany({
        companyName: company.name,
        userId: user.id,
        client: client,
        addressProperties,
        companyDetailsProperties,
        companyPreferencesProperties,
      });

      const job = await createOrUpdateJob({
        job: {
          title: jobTitle,
          userId: user.id,
          companyId: newCompany.id,
          description: jobDescription,
          workMode: workMode,
          compensation: {
            payAmount: payAmount,
            payFrequency: payFrequency,
            currency: currency,
          },
          address: addressProperties,
        },
        client: client,
      });

      await client.application.create({
        data: {
          status: status,
          applicationLink: applicationLink,
          applicationDate: applicationDate,
          positionIndex: positionIndex,
          notes: notes,
          applicationGroup: {
            connect: {
              id: applicationGroup.id,
            },
          },
          job: {
            connect: {
              id: job.id,
            },
          },
        },
      });

      await incrementCardsAfterIndex({
        groupId: applicationGroup.id,
        status: status,
        index: positionIndex,
        client: client,
      });
    });
    return new Response(JSON.stringify({ error: null }), { status: 200 });
  } catch (error) {
    reportError(error);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
