import React from 'react';
import { Button, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { MdDelete, MdEdit } from 'react-icons/md';

interface DataType {
  key: string;
  subject: string;
  teacher: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Subject',
    dataIndex: 'subject',
  },
  {
    title: 'Teacher',
    dataIndex: 'teacher'
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
    subject: 'ADLD',
    teacher: 'Raj',
  },
  {
    key: '2',
    subject: 'OS',
    teacher: 'Rahul',
  },
];

const SectionAddTable: React.FC = () => {
return(
<div>
<Table<DataType> columns={columns} dataSource={data} pagination={false}/>
</div>
);};

export default SectionAddTable;