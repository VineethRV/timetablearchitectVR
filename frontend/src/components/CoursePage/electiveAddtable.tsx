import React from 'react';
import { Button, Table, Tag, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { MdDelete, MdEdit } from 'react-icons/md';

export interface Elective {
  course: string;
  teachers: string[];
  rooms: string[] | null;
}


const ElectiveAddTable = ({
  electiveData,
  setElectivesData,
  onEditClick
}: {
  electiveData: Elective[];
  setElectivesData: React.Dispatch<React.SetStateAction<Elective[]>>;
  onEditClick: (record: Elective) => void; 
}) => {

  const handleDeleteClick = (record: Elective) => {
    setElectivesData((prevData) => prevData.filter((item) => item.course !== record.course));
  };



  const columns: TableProps<Elective>['columns'] = [
    {
      title: 'Course',
      dataIndex: 'course',
    },
    {
      title: 'Teachers',
      dataIndex: 'teachers',
      render: (_, { teachers }) => (
        <>
          {teachers.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Rooms',
      dataIndex: 'rooms',
      render: (_, { rooms }) => (
        <>
          {rooms?.map((tag) => (
            <Tag color="purple" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '',
      render: (record) => (
        <Tooltip title="Edit">
          <Button
            type="primary"
            onClick={() => onEditClick(record)}
            shape="circle"
            icon={<MdEdit />}
          />
        </Tooltip>
      ),
    },
    {
      title: '',
      render: (record) => (
        <Tooltip title="Delete">
          <Button
            className="bg-red-400"
            type="primary"
            onClick={() => handleDeleteClick(record)}
            shape="circle"
            icon={<MdDelete />}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <Table<Elective> columns={columns} dataSource={electiveData} pagination={false} />
    </div>
  );
};

export default ElectiveAddTable;
