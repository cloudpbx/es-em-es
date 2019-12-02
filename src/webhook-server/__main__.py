"""
Receives Telnyx webhooks.
"""

from aiohttp import web

routes = web.RouteTableDef()

@routes.get('/webhook/oV2KDfSKNQb1SRMGsRzJ')
async def incoming_webhook(request: web.Request):
    data = await request.json()
    print(data)
    return web.Response(text="Hello, world")

if __name__ == "__main__":
    app = web.Application()
    app.add_routes(routes)
    web.run_app(app)