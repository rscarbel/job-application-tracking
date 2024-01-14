import prisma from "@/services/globalPrismaClient";
import {
  decrementCardsAfterIndex,
  deleteCard,
  getFormattedCardsForBoard,
} from "@/services/applicationService";
import { calculateBoardStructure } from "../calculateBoardStructure";
import { reportError } from "@/app/api/reportError/reportError";
import serverErrorResponse from "../../serverErrorResponse";
import { getRequestUser } from "@/services/userService";
import { ExtendedNextApiRequest } from "@/app/api/ExtendedNextApiRequest";

export async function POST(request: ExtendedNextApiRequest) {
  const user = await getRequestUser(request);
  const { id } = await request.json();

  const cardToDelete = await prisma.application.findUnique({
    where: { id: id },
    include: {
      job: true,
      applicationGroup: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!cardToDelete) {
    return new Response(
      JSON.stringify({
        error: "Card not found.",
      }),
      { status: 404 }
    );
  }

  if (cardToDelete.applicationGroup.userId !== user.id) {
    serverErrorResponse("Unauthorized", 401);
  }

  const indexToDecrement = cardToDelete.positionIndex + 1;
  const applicationGroupId = cardToDelete.applicationGroupId;

  try {
    await prisma.$transaction(async (pris) => {
      await decrementCardsAfterIndex({
        status: cardToDelete.status,
        index: indexToDecrement,
        groupId: applicationGroupId,
        client: pris,
      });
      await deleteCard({ id: parseInt(id), client: pris });
    });
    const formattedCards = await getFormattedCardsForBoard({
      groupId: applicationGroupId,
    });
    const board = calculateBoardStructure(formattedCards);

    return new Response(JSON.stringify({ board }), {
      status: 200,
    });
  } catch (error) {
    reportError(error, user);
    return serverErrorResponse();
  }
}
