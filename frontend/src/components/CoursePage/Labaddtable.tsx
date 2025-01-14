import { Button, Table, Tag, Tooltip } from "antd";
import type { TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";

export interface Labs {
  key: string;
  courseSet: string;
  course: string;
  teachers: string[];
  rooms: string[];
}

const LabAddTable = ({
  LabData,
  setLabData,
  onEditClick
}: {
  LabData: Labs[];
   onEditClick: (record: Labs[]) => void; 
  setLabData: React.Dispatch<React.SetStateAction<Labs[]>>;
}) => {

  const handleDelete = (record: Labs) => {
    console.log("rec",record)
      setLabData((prevData) =>
        prevData.filter(
          (item) =>
            !(
              (item.courseSet) == (record.courseSet) 
            )
        )
      )
};

  const columns: TableProps<Labs>["columns"] = [
    {
      title: "Course Set",
      dataIndex: "courseSet",
      render:(_,record,index:any)=>{
        if (record.key !='0') {
              return {
                props: {
                  children:null,
                  rowSpan: 0, // Merge the current cell with the previous cell
                },
              };
            }
        let rowSpan = 1;
           for (let i = index + 1; i < LabData.length; i++) {
             if (LabData[i].key!='0') {
               rowSpan++;
             } else {
               break;
             }
           }
           return {
            children: record.courseSet, 
            props: {
              rowSpan, 
            },
          };
      }
    },
    {
      title: "Course",
      dataIndex: "course",
    },
    {
      title: "Teachers",
      dataIndex: "teachers",
      render: (_, { teachers }) => (
        <>
          {teachers.map((teacher,tag) => (
            <Tag color="blue" key={tag}>
              {teacher.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Rooms",
      dataIndex: "rooms",
      render: (_, { rooms }) => (
        <>
          {rooms[0].split(",").map((tag) => (
            <Tag color="purple" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "",
      render: (text:any,record: any, index: number) => {
              if (text.key =='0' || index === 0) {
                const recordsInGroup = [record];
                let rowSpan = 1;
                for (let i = index + 1; i < LabData.length; i++) {
                  if (LabData[i].key!='0') {
                    recordsInGroup.push(LabData[i])
                    rowSpan++;
                  } else {
                    break;
                  }
                }
                return {
                  children: (
                    <div className="flex space-x-2">
                      <Tooltip title="Edit">
                  <Button
                    type="primary"
                    onClick={() => onEditClick(recordsInGroup)}
                    shape="circle"
                    icon={<MdEdit />}
                  />
                </Tooltip>
                    </div>
                  ),
                  props: {
                    rowSpan,
                  },
                };
              } else {
                return {
                  children: null,
                  props: {
                    rowSpan: 0, // Merge this row with the previous one
                  },
                };
              }
            },
          },
    {
      title: "",
       render: (text:any,record: any, index: number) => {
               if (text.key== "0" || index === 0) {
                let rowSpan = 1;
                for (let i = index + 1; i < LabData.length; i++) {
                  if (LabData[i].key!='0') {
                    rowSpan++;
                  } else {
                    break;
                  }
                }
                 return {
                   children: (
                     <div className="flex space-x-2">
                       <Tooltip title="Delete">
                         <Button
                           className="bg-red-400"
                           type="primary"
                           shape="circle"
                           onClick={() => handleDelete(record)}
                           icon={<MdDelete />}
                         />
                       </Tooltip>
                     </div>
                   ),
                   props: {
                     rowSpan,
                   },
                 };
               } else {
                 return {
                   children: null,
                   props: {
                     rowSpan: 0, // Merge this row with the previous one
                   },
                 };
               }
             },
           }
  ];

  return (
    <div>
      <Table<Labs> columns={columns} dataSource={LabData} pagination={false} />
    </div>
  );
};

export default LabAddTable;
