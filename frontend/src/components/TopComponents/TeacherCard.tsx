import { Users } from 'lucide-react';
import { Card } from './Card';
import { TeacherItem } from './TeacherItem';

export function TeacherCard({ teachers }: any) {
  return (
    <Card title="Top 10 Free Teachers" icon={Users}>
      {teachers.slice(0, 10).map((teacher:any) => (
        <TeacherItem key={teacher.id} teacher={teacher} />
      ))}
    </Card>
  );
}