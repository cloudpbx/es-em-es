"""
Receives Telnyx webhooks.
"""
import socketio
from aiohttp import web

routes = web.RouteTableDef()
# create a Socket.IO server and attach it to the aiohttp app.
sio = socketio.AsyncServer(async_mode="aiohttp")


@routes.post("/webhook/oV2KDfSKNQb1SRMGsRzJ")
async def incoming_webhook(request: web.Request):
    data = await request.json()
    print(data)
    return web.Response(text="Hello, world")


@sio.event
async def connect(sid, environ):
    print(environ)
    await sio.save_session(sid, environ)

@sio.event
async def message(sid, data):
    session = await sio.get_session(sid)
    print('message from ', session['username'])


if __name__ == "__main__":
    # Create the webhook server app.
    app = web.Application()
    app.add_routes(routes)

    # Attach socket to the aiohttp app.
    sio.attach(app)

    web.run_app(app)
