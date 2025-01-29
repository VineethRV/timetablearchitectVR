import React from "react";
import { Button, Table, TableProps, Tag, Tooltip } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { statusCodes } from "../../types/statusCodes";
import { convertTableToString, stringToTable } from "../../utils/main";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


export interface Section
{
  id: number;
    name: string;
  courses: string[];
  teachers: string[];
  rooms: string[];
}

const _rowSelection: TableProps<Section>["rowSelection"] = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: Section[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record: Section) => ({
    disabled: record.name === "Disabled User",
    name: record.name,
  }),
};

const SectionTable = ({
  sectionData,
  setSectionData,
}: {
  sectionData: Section[];
  setSectionData: React.Dispatch<React.SetStateAction<Section[]>>;
}) => {
  const navigate=useNavigate();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Courses",
      dataIndex: "courses",
      key: "courses",
      render: (courses:any) => (
        <>
          {courses.map((course:string, index:any) => (
            <Tag color="blue" key={index}>
              {course}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Teachers",
      dataIndex: "teachers",
      key: "teachers",
      render: (teachers:any) => (
        <>
          {teachers.map((teacher:string, index:any) => (
            <Tag color="green" key={index}>
              {teacher}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Rooms",
      dataIndex: "rooms",
      render: (rooms:any) => (
        <>
          {rooms.map((room:string, index:any) => (
            <Tag color="purple" key={index}>
              {room}
            </Tag>
          ))}
        </>
      ),
    },
    {
        title: "",
        render: (record:any) => {
          return (
            <Tooltip title="Edit">
              <Button
                type="primary"
                shape="circle"
                onClick={()=>{handleEdit(record.id,record.name,record.temporary?record.temporary:0)}}
                icon={<MdEdit />}
              />
            </Tooltip>
          );
        },
      },
      {
        title: "",
        render: (record:any) => {
          return (
            <Tooltip title="Delete">
              <Button
               className="bg-red-400 "
               onClick={()=>deleteSection(record)}
                type="primary"
                shape="circle"
                icon={<MdDelete />}
              />
            </Tooltip>
          );
        },
      },
  ];

  function handleEdit(id:number,oldname:string,temp:any) {
    console.log("temp is",temp);
    if(temp==1)
    {
      navigate(
        `/dashboard/section/edit/${encodeURIComponent(id)}/${encodeURIComponent(oldname)}?temp=${encodeURIComponent(temp)}`
      );
    }
    else{
    navigate(
      `/dashboard/section/edit/${encodeURIComponent(id)}/${encodeURIComponent(oldname)}`
    );
  }
  }
  function deleteSection(record: Section) {
    console.log("rec",record)
    const res = axios
      .delete(BACKEND_URL + "/sections", {
        data: {
          sectionid: record.id
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res, "res");
        const status = res.data.status;
        switch (status) {
          case statusCodes.OK:
            const teachers=record.teachers;
            const rooms=record.rooms;
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
                    if (hour == record.name) {
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
                    if (hour == record.name) {
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
            setSectionData((ele) => {
              const newEles = ele.filter((t) => {
                  if (record.id == t.id) return false;
                return true;
              });
              return newEles;
            });
            //setSelectedElectives([]);
            toast.success("Section deleted successfully");
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
        }
      });

    toast.promise(res, {
      loading: "Deleting the Section",
    });
   }
  return <Table columns={columns} dataSource={sectionData} rowKey="name" />;
};

export default SectionTable;
