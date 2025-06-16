import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, message } from 'antd';
import axios from 'axios';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please input ${title}!` }]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const User = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/auth/message`);
        const users = res.data.map(user => ({ ...user, key: user._id }));
        setDataSource(users);
      } catch (err) {
        message.error('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey('');

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => item.key === key);

      if (index > -1) {
        const item = newData[index];
        const updated = { ...item, ...row };

        await axios.put(`http://localhost:3000/api/auth/messageupdate/${key}`, updated);

        newData.splice(index, 1, updated);
        setDataSource(newData);
        setEditingKey('');
        message.success('User updated');
      }
    } catch (err) {
      console.error('Update error:', err);
      message.error('Update failed');
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:3000/api/auth/messagedelete/${key}`);
      setDataSource(dataSource.filter(item => item.key !== key));
      message.success('User deleted');
    } catch (err) {
      console.error(err);
      message.error('Delete failed');
    }
  };

  const columns = [
    {
      title: 'Body',
      dataIndex: 'body',
      editable: true,
    },
    {
      title: 'Seat',
      dataIndex: 'seat',
      editable: true,
    },
    {
      title: 'Fuel Type',
      dataIndex: 'fuel',
      editable: true,
    },
    {
      title: 'Engine',
      dataIndex: 'engine',
      editable: true,
    },
    {
      title: 'Transmission',
      dataIndex: 'transmission',
      editable: true,
    },
    {
      title: 'Fuel Economy',
      dataIndex: 'average',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>Save</a>
            <Popconfirm title="Cancel changes?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a disabled={editingKey !== ''} onClick={() => edit(record)} style={{ marginRight: 8 }}>Edit</a>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <h2>Contact Table</h2>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default User;
