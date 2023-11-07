import { getFormattedCardData } from "@/services/applicationCardService";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cardId = parseInt(searchParams.get("cardId"));

  if (!cardId) {
    return Response.json({
      status: 400,
      body: { error: "Invalid cardId" },
    });
  }

  const card = await getFormattedCardData(cardId);

  if (!card) {
    return Response.json({
      status: 404,
      body: { error: "Card not found" },
    });
  }

  return Response.json({
    body: JSON.stringify(card),
  });
}
