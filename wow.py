import asyncio
import websockets

async def test():
    uri = "ws://192.168.0.107:24124"
    async with websockets.connect(uri) as websocket:
        greeting = await websocket.recv()
        print("Received:", greeting)

        await websocket.send("Aimbot!")
        response = await websocket.recv()
        print("Response:", response)

asyncio.run(test())
