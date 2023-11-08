import { reportError } from "@/app/api/reportError/reportError";
import { createApplicationBoard } from "@/services/applicationBoardService";
import { getRequestUser } from "@/services/userService";
import { getToken } from "next-auth/jwt";
import unauthorizedResponse from "../../unauthorizedResponse";
import serverErrorRespionse from "../../serverErrorResponse";

export async function POST(request) {
  const { name } = await request.json();
  if (typeof name !== "string") {
    return new Response(
      JSON.stringify({
        error: "Request requires a name property as a string.",
      }),
      { status: 400 }
    );
  }

  const token = await getToken({ req: request });
  const { sub, provider } = token || { sub: null, provider: null };
  if (!sub || typeof provider !== "string") return unauthorizedResponse;

  const user = await getRequestUser({ sub, provider });

  try {
    await createApplicationBoard({
      name,
      userId: user.id,
    });
  } catch (error) {
    reportError(error);

    return serverErrorRespionse;
  }
}
