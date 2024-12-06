import React from 'react';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  key: string;
  subject: string;
  teachers: string[];
  rooms: string[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Subject',
    dataIndex: 'subject',
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
  }
];

const data: DataType[] = [
  {
    key: '1',
    subject: 'ADLD/OS/ADLD',
    teachers: ['Raj','Jai','Rahul'],
    rooms:['Lab 1','Lab 2','Lab 3']
  },
  {
    key: '2',
    subject: 'OS/ADLD/OS',
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