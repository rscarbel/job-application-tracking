import prisma from "@/services/globalPrismaClient";
import { findOrCreateCompany } from "@/services/companyService";
import { createOrUpdateJob } from "@/services/jobService";
import { incrementCardsAfterIndex } from "@/services/applicationService";
import { reportError } from "@/app/api/reportError/reportError";
import { getCurrentUser } from "@/services/UserManagement";
import { CreateCardRequest } from "./interface";
import serverErrorResponse from "@/app/api/serverErrorResponse";
import { ApiRequest } from "@/utils/ApiRequestType";

export async function POST(request: ApiRequest) {
  const requestData = await request.body.json();
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

  const user = await getCurrentUser(request);
  if (!user) return serverErrorResponse("User not found", 404);

  try {
    await prisma.$transaction(async (client) => {
      const addressProperties = {
        streetAddress,
        streetAddress2,
        city,
        state,
        postalCode,
        country,
      };

      const applicationGroup = await client.applicationGroup.findFirst({
        where: {
          id: groupId,
          userId: user.id,
        },
      });

      if (!applicationGroup) {
        throw new Error("Application Group not found");
      }

      const newCompany = await findOrCreateCompany({
        companyName: company.name,
        userId: user.id,
        client: client,
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      reportError(error, user);
      return serverErrorResponse(error.message, 500);
    }
  }
}
