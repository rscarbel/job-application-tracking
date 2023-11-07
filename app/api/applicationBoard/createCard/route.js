import prisma from "@/services/globalPrismaClient";
import { findOrCreateCompany } from "@/services/companyService";
import { createOrUpdateJob } from "@/services/jobService";
import { incrementCardsAfterIndex } from "@/services/applicationCardService";
import { reportError } from "@/app/api/reportError/reportError";

export async function POST(request) {
  const {
    status,
    applicationBoardId,
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
  try {
    await prisma.$transaction(async (client) => {
      const user = await client.user.findFirst({
        where: {
          id: 1,
        },
      });

      const addressProperties = {
        streetAddress,
        streetAddress2: streetAddress2 || "",
        city,
        state,
        postalCode,
        country,
      };

      const applicationBoard = await client.applicationBoard.findFirst({
        where: {
          id: applicationBoardId,
        },
      });

      const newCompany = await findOrCreateCompany({
        companyName: company.name,
        userId: user.id,
        client: client,
        addressProperties,
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
          applicationBoard: {
            connect: {
              id: applicationBoard.id,
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
        boardId: applicationBoard.id,
        status: status,
        index: positionIndex,
        client: client,
      });
    });
    return new Response(null, { status: 200 });
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
