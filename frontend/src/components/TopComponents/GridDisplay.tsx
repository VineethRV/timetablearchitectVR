import { TeacherCard } from './TeacherCard';
import { RoomCard } from './RoomCard';
import { LabCard } from './LabCard';


export function GridDisplay({ teachers, rooms,labs } : any) {
  return (
    <div className="py-4 bg-gray-50 min-h-screen">
      <div className="max-w-[90rem] mx-auto space-y-8">
        {teachers && teachers.length > 0 && <TeacherCard teachers={teachers} />}
        {rooms && rooms.length > 0 && <RoomCard rooms={rooms} />}
        {labs && labs.length > 0 && <LabCard labs={labs} />}
      </div>
    </div>
  );
}