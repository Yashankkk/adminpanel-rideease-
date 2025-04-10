// File: User.jsx (or whatever component you are using for users)
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, message } from 'antd';
import axios from 'axios';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div style={{ paddingInlineEnd: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const User = () => {
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);

  // Fetch users from MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/auth/message`);
        const usersWithKeys = res.data.map((user, index) => ({ ...user, key: user._id }));
        setDataSource(usersWithKeys);
        setCount(usersWithKeys.length);
      } catch (err) {
        message.error('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (key) => {
    try {
      await axios.delete(`http://localhost:3000/api/auth/messagedelete/${key}`);
      // setDataSource(dataSource.filter((item) => item.key !== key));
      message.success('User deleted');
    } catch (err) {
      console.log(err);
      
      message.error('Delete failed');
    }
  };

  const handleSave = async (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    const updated = { ...item, ...row };

    try {
      await axios.put(`http://localhost:3000/api/auth/messageupdate/${row.key}`, updated);
      // newData.splice(index, 1, updated);
      // setDataSource(newData);
      message.success('User updated');
    } catch (err) {
      message.error('Update failed');
    }
  };

  const defaultColumns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      editable: true,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      editable: true,
    },
    {
      title: 'Message',
      dataIndex: 'message',
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <h2>Contact Table</h2>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

export default User;
