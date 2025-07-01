from fastapi import WebSocket
from typing import List
import json

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active_connections.append(ws)

    async def disconnect(self, ws: WebSocket):
        self.active_connections.remove(ws)
        await ws.close()

    async def broadcast(self, data: dict):
        message = json.dumps(data)
        for connection in self.active_connections:
            await connection.send_text(message)