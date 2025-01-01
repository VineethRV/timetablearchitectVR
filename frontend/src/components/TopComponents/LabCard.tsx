import { FlaskConical } from "lucide-react";
import { Card } from "./Card";
import { LabItem } from "./LabItem";

export function LabCard({ labs }: any) {
  return (
    <Card title="Top 10 Free Labs" icon={FlaskConical}>
      {labs.slice(0, 10).map((lab: any) => (
        <LabItem key={lab.id} lab={lab} />
      ))}
    </Card>
  );
}
