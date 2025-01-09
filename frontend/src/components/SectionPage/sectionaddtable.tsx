import React from 'react';
import { Button, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { MdDelete, MdEdit } from 'react-icons/md';

export interface courseList
{
  key: string;
  course:string;
  teacher:string;
  room:string;
}


const SectionAddTable= (
  {
    sectionData,
    setSectionsData,
    onEditClick,
  }: {
    sectionData: courseList[];
    setSectionsData: React.Dispatch<React.SetStateAction<courseList[]>>;
    onEditClick: (record: courseList) => void;
  }
) => {
  const handleDeleteClick = (record: courseList) => {
    const updatedData = sectionData.filter(item => item.key !== record.key);
    setSectionsData(updatedData);
  };

  
const columns: TableProps<courseList>['columns'] = [
  {
    title: 'Course',
    dataIndex: 'course',
  },
  {
    title: 'Teacher',
    dataIndex: 'teacher'
  },
  {
    title: 'Room',
    dataIndex: 'room'
  },
  {
    title: "",
    render: (record) => {
      return (
        <Tooltip title="Edit">
          <Button
            type="primary"
            onClick={() => onEditClick(record)}
            shape="circle"
            icon={<MdEdit />}
          />
        </Tooltip>
      );
    },
  },
  {
    title: "",
    render: (record) => {
      return (
        <Tooltip title="Delete">
          <Button
            className="bg-red-400"
            type="primary"
            shape="circle"
            onClick={() => handleDeleteClick(record)}
            icon={<MdDelete />}
          />
        </Tooltip>
      );
    },
  }
];

return(
<div>
<Table<courseList> columns={columns} dataSource={sectionData} pagination={false}/>
</div>
);};

export default SectionAddTable;