"""
Receives Telnyx webhooks.
"""
import socketio
from aiohttp import web

routes = web.RouteTableDef()


@routes.post("/webhook/oV2KDfSKNQb1SRMGsRzJ")
async def incoming_webhook(request: web.Request):
    data = await request.json()
    print(data)
    return web.Response(text="Hello, world")


@sio.on("custom")
def another_event(sid, data):
    print(sid, data)


@sio.event
def connect(sid: str, environ: dict):
    print("Connected", environ)
    phone_number = environ.get("phoneNumber")
    async with sio.session(sid) as session:
        session["phoneNumber"] = phone_number
        return True
    raise socketio.exceptions.ConnectionRefusedError("authentication failed")


@sio.event
def message(sid: str, data):
    async with sio.session(sid) as session:
        print("message from ", session["username"])


if __name__ == "__main__":
    # Create the webhook server app.
    app = web.Application()
    app.add_routes(routes)

    # create a Socket.IO server and attach it to the aiohttp app.
    sio = socketio.AsyncServer(async_mode="aiohttp")
    sio.attach(app)

    web.run_app(app)
