import prisma from "@/services/globalPrismaClient";
import {
  createCompany,
  findCompanyByName,
  createJob,
  findJob,
} from "@/services/JobManagement";
import { incrementCardsAfterIndex } from "@/services/applicationService";
import { reportError } from "@/app/api/reportError/reportError";
import { getCurrentUser } from "@/services/UserManagement";
import { CreateCardRequest } from "./interface";
import serverErrorResponse from "@/app/api/serverErrorResponse";
import { ApiRequest } from "@/utils/ApiRequestType";
import { Job } from "@prisma/client";

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

      let jobCompany = await findCompanyByName({
        name: company.name,
        userId: user.id,
        client: client,
      });

      if (!jobCompany) {
        jobCompany = await createCompany({
          name: company.name,
          userId: user.id,
          client: client,
          preferences: {
            desireability: desireability,
          },
        });
      }

      if (!jobCompany) {
        throw new Error("Unable to create company.");
      }

      let job: Job | null = await findJob({
        title: jobTitle,
        userId: user.id,
        company: jobCompany,
        workMode: workMode,
        client: client,
      });

      if (!job) {
        job = await createJob({
          title: jobTitle,
          userId: user.id,
          company: jobCompany,
          workMode: workMode,
          description: jobDescription,
          compensation: {
            payAmount: payAmount,
            payFrequency: payFrequency,
            currency: currency,
          },
          address: addressProperties,
          client: client,
        });
      }

      if (!job) {
        throw new Error("Unable to create job.");
      }

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
          user: {
            connect: {
              id: user.id,
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
