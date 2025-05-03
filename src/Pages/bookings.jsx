import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, message } from 'antd';
import axios from 'axios';

const User = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    const fetchcarDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/auth/booking`);
        const usersWithKeys = res.data.map((user) => ({ ...user, key: user._id }));
        setDataSource(usersWithKeys);
      } catch (err) {
        message.error('Failed to load car details');
      }
    };
    fetchcarDetails();
  }, []);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updated = { ...item, ...row };
        await axios.put(`http://localhost:3000/api/auth/bookingupdate/${key}`, updated);
        newData.splice(index, 1, updated);
        setDataSource(newData);
        setEditingKey('');
        message.success('User updated');
      }
    } catch (err) {
      console.log('Validate Failed:', err);
      message.error('Update failed');
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:3000/api/auth/bookingdelete/${key}`);
      setDataSource(dataSource.filter((item) => item.key !== key));
      message.success('User deleted');
    } catch (err) {
      console.log(err);
      message.error('Delete failed');
    }
  };

  const columns = [
    {
      title: 'Car Model',
      dataIndex: 'carModel',
      editable: true,
    },
    {
      title: 'Pick Up',
      dataIndex: 'pickupLocation',
      editable: true,
    },
    {
      title: 'Drop Off',
      dataIndex: 'dropoffLocation',
      editable: true,
    },
    {
      title: 'Pick Up Date',
      dataIndex: 'pickupDate',
      editable: true,
    },
    {
      title: 'Return Date',
      dataIndex: 'returnDate',
      editable: true,
    },
    {
      title: 'Price Per Day',
      dataIndex: 'pricePerDay',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <a
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              Edit
            </a>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          </>
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

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
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

  return (
    <div>
      <h2>Editable Booking Table</h2>
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
