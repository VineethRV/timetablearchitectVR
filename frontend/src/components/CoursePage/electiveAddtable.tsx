import React from 'react';
import { Button, Table, Tag, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { MdDelete, MdEdit } from 'react-icons/md';

interface DataType {
  key: string;
  course: string;
  courseCode: string;
  teachers: string[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Course',
    dataIndex: 'course',
  },
  {
    title: 'Course Code',
    dataIndex: 'courseCode',
  },
  {
    title: 'Teachers',
    dataIndex: 'teachers',
    render: (_, { teachers }) => (
        <>
          {teachers.map((tag) => {
            const color = 'blue'
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
  },
  {
    title: "",
    render: () => {
      return (
        <Tooltip title="Edit">
          <Button
            type="primary"
           // onClick={() => handleEditClick(record.name, record.department)}
            shape="circle"
            icon={<MdEdit />}
          />
        </Tooltip>
      );
    },
  },
  {
    title: "",
    render: () => {
      return (
        <Tooltip title="Delete">
          <Button
            className="bg-red-400"
            type="primary"
            shape="circle"
            //onClick={() => handleDeleteClick(record)}
            icon={<MdDelete />}
          />
        </Tooltip>
      );
    },
  }
];

const data: DataType[] = [
  {
    key: '1',
    course: 'BioSafety',
    courseCode: 'B223AT',
    teachers: ['Raj','Jai','Rahul'],
  },
  {
    key: '2',
    course: 'Civil',
    courseCode: 'C223AT',
    teachers: ['Raj','Rohan','John'],
  },
];

const ElectiveAddTable: React.FC = () => {
return(
<div>
<Table<DataType> columns={columns} dataSource={data} pagination={false}/>
</div>
);};

export default ElectiveAddTable;