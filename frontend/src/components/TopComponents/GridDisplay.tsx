import { TeacherCard } from './TeacherCard';
import { RoomCard } from './RoomCard';
import { LabCard } from './LabCard';


export function GridDisplay({ teachers, rooms,labs } : any) {
  return (
    <div className="py-4 bg-gray-50 min-h-screen">
      <div className="max-w-[90rem] mx-auto space-y-8">
        <TeacherCard teachers={teachers} />
        <RoomCard rooms={rooms} />
        <LabCard labs={labs} />
      </div>
    </div>
  );
}