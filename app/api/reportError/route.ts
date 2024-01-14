import { reportError } from "./reportError";
import serverErrorResponse from "../serverErrorResponse";

export async function POST(request: Request): Promise<Response> {
  try {
    const { error } = await request.json();

    reportError(error);

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
