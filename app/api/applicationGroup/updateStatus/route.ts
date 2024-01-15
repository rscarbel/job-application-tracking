import prisma from "@/services/globalPrismaClient";
import { getRequestUser } from "@/services/userService";
import { reportError } from "@/app/api/reportError/reportError";
import serverErrorResponse from "../../serverErrorResponse";
import { ApplicationStatus } from "@prisma/client";

interface RequestBody {
  id: string;
  status: ApplicationStatus;
  newPositionIndex: number;
}

export async function POST(request) {
  const { id, status, newPositionIndex }: RequestBody = await request.json();
  const user = await getRequestUser(request);
  if (!user) return serverErrorResponse("The request user does not exist", 404);

  const currentCard = await prisma.application.findUnique({
    where: { id: parseInt(id) },
    include: {
      applicationGroup: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!currentCard) return serverErrorResponse("The card does not exist", 404);
  if (currentCard.applicationGroup.userId !== user.id) {
    return serverErrorResponse("Unauthorized", 401);
  }

  let updatedCard;
  try {
    await prisma.$transaction(async (pris) => {
      // Check if the card is moved within the same column or to a new column
      if (currentCard.status === status) {
        // Moved within the same column
        if (currentCard.positionIndex < newPositionIndex) {
          // Moved down
          await pris.application.updateMany({
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
          await pris.application.updateMany({
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
        await pris.application.updateMany({
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
        await pris.application.updateMany({
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

      updatedCard = await pris.application.update({
        where: { id: parseInt(id) },
        data: { status: status, positionIndex: newPositionIndex },
      });
    });

    return new Response(JSON.stringify({ error: null, card: updatedCard }), {
      status: 200,
    });
  } catch (error) {
    reportError(error, user);
    return serverErrorResponse(error.message, 500);
  }
}
