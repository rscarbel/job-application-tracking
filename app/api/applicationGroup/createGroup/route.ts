import { reportError } from "@/app/api/reportError/reportError";
import { createApplicationBoard } from "@/services/applicationGroupService";
import { getRequestUser } from "@/services/userService";
import serverErrorResponse from "../../serverErrorResponse";

export async function POST(request) {
  const { name } = await request.json();
  if (typeof name !== "string") {
    return serverErrorResponse(
      "Request requires a name property as a string.",
      400
    );
  }

  const user = await getRequestUser(request);
  if (!user) return serverErrorResponse("User not found", 404);

  try {
    await createApplicationBoard({
      name,
      userId: user.id,
    });
  } catch (error) {
    reportError(error);

    return serverErrorResponse();
  }
}
