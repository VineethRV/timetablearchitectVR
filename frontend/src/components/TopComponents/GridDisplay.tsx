import { TeacherCard } from './TeacherCard';
import { RoomCard } from './RoomCard';


export function GridDisplay({ teachers, rooms } : any) {
  return (
    <div className="py-2 bg-gray-50 min-h-screen">
      <div className="max-w-[90rem] mx-auto space-y-8">
        <TeacherCard teachers={teachers} />
        <RoomCard rooms={rooms} />
      </div>
    </div>
  );
}