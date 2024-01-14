const DEFAULT_ERROR_MESSAGE: string =
  "Something has gone wrong on the server. We have been notified of the error.";
const DEFAULT_STATUS_CODE: number = 500;

const serverErrorResponse = (
  message: string = DEFAULT_ERROR_MESSAGE,
  statusCode: number = DEFAULT_STATUS_CODE
): Response =>
  new Response(
    JSON.stringify({
      error: message,
    }),
    { status: statusCode }
  );

export default serverErrorResponse;
