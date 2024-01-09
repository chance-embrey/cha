Bun.serve({
  port: 8080,
  fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === "/cha") {
      return chaHandler(request);
    }
    return new Response("unavailable");
  },
});

function chaHandler(request: Request) {
  return new Response("cha");
}
