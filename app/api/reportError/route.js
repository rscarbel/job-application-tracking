import { reportError } from "./reportError";

export async function POST(request) {
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
    return new Response(JSON.stringify({ error: "Failed to report error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
