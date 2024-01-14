import prisma from "@/services/globalPrismaClient";
import {
  decrementCardsAfterIndex,
  incrementCardsAfterIndex,
  getFormattedCardsForBoard,
} from "@/services/applicationService";
import { updateCompany } from "@/services/companyService";
import { updateJob } from "@/services/jobService";
import { calculateBoardStructure } from "../calculateBoardStructure";
import { reportError } from "@/app/api/reportError/reportError";
import { getRequestUser } from "@/services/userService";
import serverErrorResponse from "../../serverErrorResponse";

export async function POST(request) {
  const {
    applicationId,
    groupId,
    company,
    jobId,
    jobTitle,
    jobDescription,
    workMode,
    payAmount,
    payFrequency,
    currency,
    streetAddress,
    city,
    state,
    country,
    postalCode,
    applicationLink,
    applicationDate,
    notes,
    status,
  } = await request.json();

  const necessaryData = {
    "Application Card": applicationId,
    Board: groupId,
    "Company Name": company.name,
    "Job Title": jobTitle,
  };

  const dataMissing = Object.keys(necessaryData).filter(
    (key) => !necessaryData[key]
  );

  if (dataMissing.length)
    return serverErrorResponse(
      `Request is missing ${dataMissing.join(", ")}`,
      400
    );

  const user = await getRequestUser(request);

  const currentCard = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  try {
    await prisma.$transaction(async (pris) => {
      let currentIndex = currentCard.positionIndex;
      // If the status has changed, adjust position indices accordingly
      if (currentCard.status !== status) {
        const indexToDecrement = currentIndex + 1;
        currentIndex = 0;
        // Adjust for the old column
        await decrementCardsAfterIndex({
          status: currentCard.status,
          index: indexToDecrement,
          groupId: groupId,
          client: pris,
        });

        // Adjust for the new column (move everything down)
        await incrementCardsAfterIndex({
          status: status,
          index: currentIndex,
          groupId: groupId,
          client: pris,
        });
      }

      await updateCompany({
        companyName: company.name,
        companyId: company.companyId,
        client: pris,
      });

      await updateJob({
        job: {
          id: jobId,
          userId: user.id,
          title: jobTitle,
          responsibilities: [],
          companyId: company.companyId,
          description: jobDescription,
          workMode: workMode,
          compensation: {
            payAmount: payAmount,
            payFrequency: payFrequency,
            currency: currency,
          },
          address: {
            streetAddress: streetAddress,
            city: city,
            state: state,
            country: country,
            postalCode: postalCode,
          },
        },
        client: pris,
      });

      await pris.application.update({
        where: { id: applicationId },
        data: {
          applicationLink: applicationLink,
          applicationDate: applicationDate,
          positionIndex: currentIndex,
          notes: notes,
          status: status,
        },
      });
    });
    const formattedCards = await getFormattedCardsForBoard(groupId);
    const board = calculateBoardStructure(formattedCards);

    return new Response(JSON.stringify({ board }), {
      status: 200,
    });
  } catch (error) {
    console.error(error.stack);
    reportError(error);
    return serverErrorResponse(error.message, 500);
  }
}
