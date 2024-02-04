import { reportError } from "./reportError";
import serverErrorResponse from "../serverErrorResponse";
import { getCurrentUser } from "@/services/UserManagement";
import { ApiRequest } from "@/utils/ApiRequestType";

export async function POST(request: ApiRequest): Promise<Response> {
  try {
    const { error } = await request.body.json();
    const user = await getCurrentUser(request);
    reportError(error, user);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to report to Bugsnag:", error);
    return serverErrorResponse("Failed to report error", 500);
  }
}
