import React, { useState } from "react";
import { Button, ConfigProvider, Input, Table, Tag, Tooltip } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import { statusCodes } from "../../types/statusCodes";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import { TbTrash } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import { Elective } from "../../types/main";
import { stringToTable,convertTableToString } from "../../utils/main";
interface Ele
{
  key: string;name: string; courses: string; rooms: string; teachers: string;
}

const ElectivesTable = ({
  ElectiveData,
  setElectivesData,
}: {
  ElectiveData: Elective[];
  setElectivesData: React.Dispatch<React.SetStateAction<Elective[]>>;
}) => {
  const navigate = useNavigate();

  const handleEditClick = (name: string, department: string,semester:any) => {
    navigate(
      `/dashboard/courses/electives/edit/${encodeURIComponent(
        name
      )}/${encodeURIComponent(department)}/${encodeURIComponent(semester)}`
    );
  };

  const [selectedElectives, setSelectedElectives] = useState<Ele[]>([]);

  const formatElectiveData = (ElectiveData: Elective[]): Ele[] => {
    return ElectiveData.map((Elective) => {
      const names = Elective.name.split(";");
      const courses = Elective.courses?.split(";") || [];
      const rooms = Elective.rooms?.split(";") || [];
      const teachers = Elective.teachers?.split(";") || [];
  
      const maxLength = Math.max(names.length, courses.length, rooms.length, teachers.length);
  
      return Array.from({ length: maxLength }, (_, index) => ({
        key: `${Elective.name}`, 
        name: index===0?Elective.name.trim():"",
        courses: courses[index]?.trim() || "",
        rooms: rooms[index]?.trim() || "",
        teachers: teachers[index]?.trim() || "",
        department: Elective.department,
        semester: Elective.semester,
      }));
    }).flat(); 
  };
  
  const formattedElectiveData = React.useMemo(() => formatElectiveData(ElectiveData), [ElectiveData]);
  console.log(formattedElectiveData)
  const rowSelection: TableProps<Ele>["rowSelection"] = {
    onChange: (_: React.Key[], selectedRows: Ele[]) => {
      setSelectedElectives(selectedRows);
    }
  };

  // Function to delete a single Elective
  function deleteSingleElective(record: Ele[]) {
    console.log("rec",record)
    const res = axios
      .delete(BACKEND_URL + "/electives", {
        data: {
          name: record[0].key,
          semester: Number(localStorage.getItem("semester")),
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const status = res.data.status;
        switch (status) {
          case statusCodes.OK:
            record.forEach(async (record) => {
            const teachers=record.teachers.split(",");
            const rooms=record.rooms.split(",");
            teachers.forEach(async teacher=>{
              const resT=await axios.post(
                BACKEND_URL+"/teachers/peek",{
                  name:teacher,
                },        
                {
                  headers: {
                    authorization: localStorage.getItem("token"),
                  },
                }
              );
              const teach=resT.data.message
                const teacherTT = stringToTable(resT.data.message.timetable);
                teacherTT.forEach((day, i) => {
                  day.forEach((hour, j) => {
                    if (hour == record.courses) {
                      teacherTT[i][j] = "Free";
                    }
                  });
                });
              teach.timetable=convertTableToString(teacherTT);
              axios.put(
                BACKEND_URL+"/teachers",{
                  originalName:teacher,
                  teacher:teach
                },        
                {
                  headers: {
                    authorization: localStorage.getItem("token"),
                  },
                }
              );
            })
            rooms.forEach(async room=>{
              const resR=await axios.post(
                BACKEND_URL+"/rooms/peek",{
                  name:room,
                },        
                {
                  headers: {
                    authorization: localStorage.getItem("token"),
                  },
                }
              );
              const roomfetch=resR.data.message
                const roomTT = stringToTable(resR.data.message.timetable);
                roomTT.forEach((day, i) => {
                  day.forEach((hour, j) => {
                    if (hour == record.courses) {
                      roomTT[i][j] = "Free";
                    }
                  });
                });
              roomfetch.timetable=convertTableToString(roomTT);
              console.log(roomfetch)
              axios.put(
                BACKEND_URL+"/rooms",{
                  originalName:room,
                  room:roomfetch
                },        
                {
                  headers: {
                    authorization: localStorage.getItem("token"),
                  },
                }
              );
            })
            setElectivesData((ele) => {
              const newEles = ele.filter((t) => {
                  if (record.key == t.name) return false;
                return true;
              });
              return newEles;
            });
          },)
            //setSelectedElectives([]);
            toast.success("Elective Cluster deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting the Electvie Cluster",
    });
   }

  // Columns configuration for the table
  const columns: TableColumnsType<Ele> = [
    {
      title: "BatchSet",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: any, index: number) => {
        if (record.name === "") {
          for (let i = index - 1; i >= 0; i--) {
            if (formattedElectiveData[i].name !== "") {
              return {
                children: null, // Ensure the cell doesn't show anything
                props: {
                  rowSpan: 0, // Merge the current cell with the previous cell
                },
              };
            }
          }
        }
    
        // For non-empty cells, calculate the rowSpan
        let rowSpan = 1;
        for (let i = index + 1; i < formattedElectiveData.length; i++) {
          console.log("f",formattedElectiveData[i])
          if (formattedElectiveData[i].name === "") {
            console.log(2)
            rowSpan++;
          } else {
            break;
          }
        }
    
        return {
          children: record.name, 
          props: {
            rowSpan, 
          },
        };
      },
    },
    {title: "Courses",
      dataIndex:"courses"
    },
    {
      title: "Teachers",
      dataIndex: "teachers",
      key: "teachers",
      render: (_, { teachers }) => (
        <>
          {teachers?.split(",").map((tag) => (
            <Tag color="blue" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Rooms",
      dataIndex: "rooms",
      key: "rooms",
      render: (_, { rooms }) => (
        <>
          {rooms?.split(",").map((tag) => (
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
        if (text.name !== "" || index === 0) {
          let rowSpan = 1;
          for (let i = index + 1; i < formattedElectiveData.length; i++) {
            if (formattedElectiveData[i].name === "") {
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
              onClick={() => handleEditClick(record.name,record.department,record.semester)}
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
      render: (text: any, record: any, index: number) => {
        if (text.name !== "" || index === 0) {
          let rowSpan = 1;
          const mergedRecords = [record];
          for (let i = index + 1; i < formattedElectiveData.length; i++) {
            if (formattedElectiveData[i].name === "") {
              rowSpan++;
              mergedRecords.push(formattedElectiveData[i]);
            } else {
              break;
            }
          }
    
          return {
            children: (
              <Button
              shape="circle"
              icon={<MdDelete />}
              className="bg-red-400 "
              type="primary"
                onClick={() => deleteSingleElective(mergedRecords)}
              >
              </Button>
            ),
            props: {
              rowSpan,
            },
          };
        } else {
          return {
            props: {
              rowSpan: 0,
            },
          };
        }
      },
    }
  ];

  // Function to handle deleting multiple Electives
  function deleteElectivesHandler(Electives: Ele[]) {
    if (selectedElectives.length == 0) {
      toast.info("Select Electives to delete !!");
      return;
    }
    const res = axios
      .delete(BACKEND_URL + "/Electives", {
        data: { Electives },
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        const statusCode = res.status;
        switch (statusCode) {
          case statusCodes.OK:
            setSelectedElectives([]);
            toast.success("Electives deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting Electives ...",
    });
  }

  return (
    <div>
      <div className="flex space-x-8 justify-between py-4">
        <Input
          className="w-fit"
          addonBefore={<CiSearch />}
          placeholder="ElectiveSet"
        />
        <ConfigProvider
          theme={{
            components: {
              Select: {
                selectorBg: "#F3F4F6FF",
              },
            },
          }}
        />
        <div className="flex space-x-2">
          <Button
            onClick={() => deleteElectivesHandler(selectedElectives)}
            className="bg-red-500 text-white font-bold"
          >
            <TbTrash />
            Delete
          </Button>
        </div>
      </div>

      <Table<Ele>
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={formattedElectiveData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ElectivesTable;
