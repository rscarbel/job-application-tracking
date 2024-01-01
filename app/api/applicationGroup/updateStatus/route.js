import prisma from "@/services/globalPrismaClient";
import { reportError } from "@/app/api/reportError/reportError";

export async function POST(request) {
  const { id, status, newPositionIndex } = await request.json();

  const currentCard = await prisma.applicationCard.findUnique({
    where: { id: parseInt(id) },
  });
  let updatedCard;
  try {
    await prisma.$transaction(async (pris) => {
      // Check if the card is moved within the same column or to a new column
      if (currentCard.status === status) {
        // Moved within the same column
        if (currentCard.positionIndex < newPositionIndex) {
          // Moved down
          await pris.applicationCard.updateMany({
            where: {
              status: status,
              positionIndex: {
                gte: currentCard.positionIndex + 1,
                lte: newPositionIndex,
              },
            },
            data: {
              positionIndex: {
                decrement: 1,
              },
            },
          });
        } else if (currentCard.positionIndex > newPositionIndex) {
          // Moved up
          await pris.applicationCard.updateMany({
            where: {
              status: status,
              positionIndex: {
                lte: currentCard.positionIndex - 1,
                gte: newPositionIndex,
              },
            },
            data: {
              positionIndex: {
                increment: 1,
              },
            },
          });
        }
      } else {
        // Moved to a new column
        // Decrease position indices in the old column
        await pris.applicationCard.updateMany({
          where: {
            status: currentCard.status,
            positionIndex: {
              gte: currentCard.positionIndex + 1,
            },
          },
          data: {
            positionIndex: {
              decrement: 1,
            },
          },
        });

        // Increase position indices in the new column
        await pris.applicationCard.updateMany({
          where: {
            status: status,
            positionIndex: {
              gte: newPositionIndex,
            },
          },
          data: {
            positionIndex: {
              increment: 1,
            },
          },
        });
      }

      updatedCard = await pris.applicationCard.update({
        where: { id: parseInt(id) },
        data: { status: status, positionIndex: newPositionIndex },
      });
    });

    return new Response(JSON.stringify({ error: null, card: updatedCard }), {
      status: 200,
    });
  } catch (error) {
    reportError(error);
    return new Response(
      JSON.stringify({
        error: error.message,
        cards: null,
      }),
      { status: 500 }
    );
  }
}
