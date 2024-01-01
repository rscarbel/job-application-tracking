import { getFormattedCardData } from "@/services/applicationService";
import { getRequestUser } from "@/services/userService";
import { getToken } from "next-auth/jwt";

export async function GET(request) {
  const token = await getToken({ req: request });
  const { sub, provider } = token || { sub: null, provider: null };
  const { searchParams } = new URL(request.url);

  const applicationId = parseInt(searchParams.get("applicationId"));

  if (!applicationId) {
    return Response.json({
      status: 400,
      body: { error: "Invalid applicationId" },
    });
  }

  const user = await getRequestUser({ sub, provider });

  const card = await getFormattedCardData({
    applicationId: applicationId,
    userId: user?.id,
  });

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
