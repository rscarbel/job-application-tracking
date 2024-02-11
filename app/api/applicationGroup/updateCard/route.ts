import prisma from "@/services/globalPrismaClient";
import {
  decrementCardsAfterIndex,
  incrementCardsAfterIndex,
  getFormattedCardsForBoard,
} from "@/services/applicationService";
import {
  createCompany,
  findCompanyByName,
  updateJob,
  findJob,
  updateCompany,
} from "@/services/JobManagement";
import { calculateBoardStructure } from "../calculateBoardStructure";
import { reportError } from "@/app/api/reportError/reportError";
import { getCurrentUser } from "@/services/UserManagement";
import serverErrorResponse from "../../serverErrorResponse";
import {
  ApplicationStatus,
  WorkMode,
  PayFrequency,
  Company,
} from "@prisma/client";
import { ApiRequest } from "@/utils/ApiRequestType";

interface UpdateCardRequestInterface {
  applicationId: number;
  groupId: number;
  company: {
    name: string;
    companyId: number | undefined;
  };
  jobId: number;
  jobTitle: string;
  jobDescription: string;
  workMode: WorkMode;
  payAmount: number;
  payFrequency: PayFrequency;
  currency: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  applicationLink: string;
  applicationDate: string;
  notes: string;
  status: ApplicationStatus;
}

export async function POST(request: ApiRequest) {
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
  }: UpdateCardRequestInterface = await request.json();

  const user = await getCurrentUser(request);

  if (!user) {
    return serverErrorResponse("No authenticated user in this request", 401);
  }

  const currentCard = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!currentCard) return serverErrorResponse("Card not found", 404);

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

      let updatedCompany: Company | null = null;

      if (company.companyId) {
        updatedCompany = await pris.company.findUnique({
          where: { id: company.companyId, userId: user.id },
        });
      }

      if (!updatedCompany) {
        updatedCompany = await createCompany({
          name: company.name,
          userId: user.id,
          client: pris,
        });
      } else {
        updatedCompany = await updateCompany({
          name: updatedCompany.name,
          userId: user.id,
          newName: company.name,
          client: pris,
        });
      }

      const job = pris.job.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        throw new Error("Job not found");
      }

      await updateJob({
        userId: user.id,
        title: jobTitle,
        responsibilities: [],
        company: updatedCompany,
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
    const formattedCards = await getFormattedCardsForBoard({
      groupId: groupId,
    });
    const board = calculateBoardStructure(formattedCards);

    return new Response(JSON.stringify({ board }), {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.stack);
      reportError(error, user);
      return serverErrorResponse(error.message, 500);
    }
  }
}
