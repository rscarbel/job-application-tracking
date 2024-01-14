import { getFormattedCardData } from "@/services/applicationService";
import { getRequestUser } from "@/services/userService";
import { getToken } from "next-auth/jwt";
import serverErrorResponse from "@/app/api/serverErrorResponse";

export async function GET(request) {
  const token = await getToken({ req: request });
  const { sub, provider } = token || { sub: null, provider: null };
  const { searchParams } = new URL(request.url);

  if (typeof sub !== "string" || typeof provider !== "string") {
    return serverErrorResponse("Unauthorized. Invalid credentials.", 401);
  }

  const applicationId = parseInt(searchParams.get("applicationId"));

  if (!applicationId) return serverErrorResponse("Invalid application id", 400);

  const user = await getRequestUser({ sub, provider });

  const card = await getFormattedCardData({
    applicationId: applicationId,
    userId: user?.id,
  });

  if (!card) return serverErrorResponse("Card not found", 404);

  return Response.json({
    body: JSON.stringify(card),
  });
}
