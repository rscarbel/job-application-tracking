import prisma from "@/services/globalPrismaClient";
import { findOrCreateCompany } from "@/services/companyService";
import { createOrUpdateJob } from "@/services/jobService";
import { incrementCardsAfterIndex } from "@/services/applicationCardService";
import { reportError } from "@/app/api/reportError/reportError";
import { getRequestUser } from "@/services/userService";
import { getToken } from "next-auth/jwt";

export async function POST(request) {
  const {
    status,
    groupId,
    jobTitle,
    company,
    payAmount,
    payFrequency,
    jobDescription,
    currency,
    streetAddress,
    streetAddress2,
    city,
    state,
    postalCode,
    country,
    applicationLink,
    workMode,
    applicationDate,
    positionIndex,
    notes,
  } = await request.json();
  const token = await getToken({ req: request });
  const { sub, provider } = token || { sub: null, provider: null };
  if (!sub || !provider)
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
        culture: "",
        desireability: 0,
        industry: "",
        size: "",
        website: "",
        type: "",
        history: "",
        mission: "",
        vision: "",
        values: "",
        description: "",
        notes: "",
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
      });

      const job = await createOrUpdateJob({
        jobTitle: jobTitle,
        userId: user.id,
        companyId: newCompany.id,
        jobDescription: jobDescription,
        workMode: workMode,
        payAmount: payAmount,
        payFrequency: payFrequency,
        currency: currency,
        addressProperties,
        client: client,
      });

      await client.applicationCard.create({
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
    return new Response({ error: null }, { status: 200 });
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
