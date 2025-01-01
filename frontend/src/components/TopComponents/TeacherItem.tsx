  import { Building2, CheckCircle } from "lucide-react";

  export function TeacherItem({ teacher }: any) {
    return (
      <div className="p-4 rounded-lg border border-gray-200 hover:border-[#636AE8] transition-colors group">
        <h3 className="font-medium text-lg text-gray-900 truncate group-hover:text-[#636AE8]">
          {teacher.name}
        </h3>
        <div className="mt-2 space-y-2">
          {teacher.score && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle color="green" className="w-4 h-4" />
              <span className="truncate">{Math.round(teacher.score * 100)}</span>
            </div>
          )}
          {teacher.department && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building2 className="w-4 h-4" />
              <span>{teacher.department}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
