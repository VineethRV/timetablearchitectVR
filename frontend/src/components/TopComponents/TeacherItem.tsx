import { Mail, Building2 } from 'lucide-react';

export function TeacherItem({ teacher }: any) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 hover:border-[#636AE8] transition-colors group">
      <h3 className="font-medium text-lg text-gray-900 truncate group-hover:text-[#636AE8]">{teacher.name}</h3>
      <div className="mt-2 space-y-2">
        {teacher.email && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span className="truncate">{teacher.email}</span>
          </div>
        )}
        {teacher.department && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Building2 className="w-4 h-4" />
            <span className="truncate">{teacher.department}</span>
          </div>
        )}
      </div>
    </div>
  );
}