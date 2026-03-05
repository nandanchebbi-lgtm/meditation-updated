import asyncio
import json
from nats.aio.client import Client as NATS
import websockets

clients = set()

async def websocket_handler(websocket):
    clients.add(websocket)
    try:
        async for message in websocket:
            pass
    finally:
        clients.remove(websocket)

async def nats_listener():
    nc = NATS()
    await nc.connect("nats://127.0.0.1:4222")

    async def message_handler(msg):
        command = msg.data.decode()
        print("Received command:", command)

        data = json.dumps({
            "type": "command",
            "command": command
        })

        for client in clients:
            await client.send(data)

    await nc.subscribe("meditation.command", cb=message_handler)

async def main():
    ws_server = await websockets.serve(websocket_handler, "localhost", 8765)

    await asyncio.gather(
        nats_listener(),
        ws_server.wait_closed()
    )

asyncio.run(main())