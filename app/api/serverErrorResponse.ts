const serverErrorRespionse = new Response(
  JSON.stringify({
    error:
      "Something has gone wrong on the server. We have been notified of the error.",
  }),
  { status: 500 }
);

export default serverErrorRespionse;
