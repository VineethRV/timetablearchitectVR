import { Building2, FlaskConical } from 'lucide-react';

export function RoomItem({ room }: any) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 hover:border-[#636AE8] transition-colors group">
      <h3 className="font-medium text-lg text-gray-900 truncate group-hover:text-[#636AE8]">{room.name}</h3>
      <div className="mt-2 space-y-2">
        {room.department && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Building2 className="w-4 h-4" />
            <span className="truncate">{room.department}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FlaskConical className="w-4 h-4" />
          <span>{room.lab ? 'Laboratory' : 'Classroom'}</span>
        </div>
      </div>
    </div>
  );
}