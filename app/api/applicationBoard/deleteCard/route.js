import prisma from "@/services/globalPrismaClient";
import {
  decrementCardsAfterIndex,
  deleteCard,
  getFormattedCardsForBoard,
} from "@/services/applicationCardService";
import { calculateBoardStructure } from "../calculateBoardStructure";
import { reportError } from "@/app/api/reportError/reportError";

export async function POST(request) {
  const { id } = await request.json();

  const cardToDelete = await prisma.applicationCard.findUnique({
    where: { id: id },
    include: {
      job: true,
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

  const indexToDecrement = cardToDelete.positionIndex + 1;
  const applicationBoardId = cardToDelete.applicationBoardId;

  try {
    await prisma.$transaction(async (pris) => {
      await decrementCardsAfterIndex({
        status: cardToDelete.status,
        index: indexToDecrement,
        boardId: applicationBoardId,
        client: pris,
      });
      await deleteCard(parseInt(id), pris);
    });
    const formattedCards = await getFormattedCardsForBoard(applicationBoardId);
    const board = calculateBoardStructure(formattedCards);

    return new Response(JSON.stringify({ board }), {
      status: 200,
    });
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
