import React from 'react';
import { Button, Table, Tag, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { MdDelete, MdEdit } from 'react-icons/md';

interface DataType {
  key: string;
  Course: string;
  teachers: string[];
  rooms: string[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Course',
    dataIndex: 'Course',
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
    title: 'Rooms',
    dataIndex: 'rooms',
    render: (_, { rooms }) => (
        <>
          {rooms.map((tag) => {
            const color = 'purple'
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
    render: (record) => {
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
    Course: 'ADLD/OS/ADLD',
    teachers: ['Raj','Jai','Rahul'],
    rooms:['Lab 1','Lab 2','Lab 3']
  },
  {
    key: '2',
    Course: 'OS/ADLD/OS',
    teachers: ['Jack','John','Will'],
    rooms:['Lab 3','Lab 7','Lab 6']
  },
];

const labAddTable: React.FC = () => {
return(
<div>
<Table<DataType> columns={columns} dataSource={data} pagination={false}/>
</div>
);};

export default labAddTable;