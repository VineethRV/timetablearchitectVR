import { TbLayoutDashboard } from "react-icons/tb";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { RxCrossCircled } from "react-icons/rx";

const capacity = [
  { title: "Labs at", capacity: 67 },
  { title: "Rooms at", capacity: 80 },
  { title: "Teachers at", capacity: 70 },
];
const stats = [{ title: "Sections formed", number: 54 },{title: "Core courses allocated", number: 12}, {title: "Alloted labs", number:84}];
const AdminPanel = () => {
  return (
    <main>
      <div className="flex space-x-2 items-center border-b-2 py-4 px-2">
        <TbLayoutDashboard size={25} />
        <h1 className="text-lg font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-3 gap-16 px-16 py-12">
        {stats.map((s) => {
          return (
            <div className="flex bg-[#E6E6FA] p-4 rounded-2xl items-center space-x-4">
              <RxCrossCircled className="w-16 h-16" />
              <div className="flex flex-col">
                <h1 className="text-base">{s.title}</h1>
                <h1 className="text-4xl">{s.number}</h1>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <div className="flex flex-row space-x-24 py-4 px-8 shadow-md bg-[#E6E6FA] w-fit rounded-xl">
          {capacity.map((c) => {
            return (
              <div className="flex flex-col space-y-2">
                <h1>{c.title}</h1>
                <div className="h-36 w-36">
                  <CircularProgressbar
                    styles={{
                      text: {
                        fontSize: "10px",
                        fontWeight: 700,
                        fill: "#000000",
                      },
                      path: {
                        stroke: "#FF5349",
                      },
                      trail: {
                        stroke: "black",
                      },
                    }}
                    value={c.capacity}
                    maxValue={100}
                    text={`${c.capacity}% Capacity`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default AdminPanel;
