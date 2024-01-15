import { getFormattedCardData } from "@/services/applicationService";
import { getRequestUser } from "@/services/userService";
import serverErrorResponse from "@/app/api/serverErrorResponse";
import { ApiRequest } from "@/utils/ApiRequestType";

export async function GET(request: ApiRequest) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get("applicationId");
  if (!applicationId) return serverErrorResponse("Invalid application id", 400);

  const user = await getRequestUser(request);

  if (!user) return serverErrorResponse("User not found", 404);

  const card = await getFormattedCardData({
    applicationId: parseInt(applicationId),
    userId: user?.id,
  });

  if (!card) return serverErrorResponse("Card not found", 404);

  return Response.json({
    body: JSON.stringify(card),
  });
}
