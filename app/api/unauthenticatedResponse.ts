const unauthenticatedResponse = new Response(
  JSON.stringify({
    error: "You must be logged in as an authorized user to make this request.",
  }),
  { status: 401 }
);

export default unauthenticatedResponse;
