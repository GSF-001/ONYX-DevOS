import type { WebSocket } from "ws";

class RoomRegistry {
  private rooms = new Map<string, Set<WebSocket>>();
  private socketRooms = new WeakMap<WebSocket, Set<string>>();

  join(room: string, socket: WebSocket): void {
    if (!this.rooms.has(room)) this.rooms.set(room, new Set());
    this.rooms.get(room)!.add(socket);

    if (!this.socketRooms.has(socket)) this.socketRooms.set(socket, new Set());
    this.socketRooms.get(socket)!.add(room);
  }

  leave(room: string, socket: WebSocket): void {
    this.rooms.get(room)?.delete(socket);
    this.socketRooms.get(socket)?.delete(room);
  }

  leaveAll(socket: WebSocket): void {
    const rooms = this.socketRooms.get(socket);
    if (!rooms) return;
    for (const room of rooms) {
      this.rooms.get(room)?.delete(socket);
    }
    this.socketRooms.delete(socket);
  }

  membersOf(room: string): Set<WebSocket> {
    return this.rooms.get(room) ?? new Set();
  }
}

export const roomRegistry = new RoomRegistry();
