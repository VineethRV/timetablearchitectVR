import { DoorOpen } from "lucide-react";
import { Card } from "./Card";
import { RoomItem } from "./RoomItem";

export function RoomCard({ rooms }: any) {
  return (
    <Card title="Top 10 Free Rooms" icon={DoorOpen}>
      {rooms.slice(0, 10).map((room: any) => (
        <RoomItem key={room.id} room={room} />
      ))}
    </Card>
  );
}
