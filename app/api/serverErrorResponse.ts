const DEFAULT_ERROR_MESSAGE = "Something has gone wrong on the server. We have been notified of the error."
const DEFAULT_STATUS_CODE = 500

const serverErrorResponse = (message = DEFAULT_ERROR_MESSAGE, statusCode = DEFAULT_STATUS_CODE) => new Response(
  JSON.stringify({
    error: message,
  }),
  { status: statusCode }
);

export default serverErrorResponse;
