import React, { useState, useRef, FC, useEffect } from 'react';
import {
  Table,
  Tag,
  Modal,
  Button,
  Popconfirm,
  Pagination,
  message,
  Layout,
  Row,
  Col,
  Space,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import type { TableProps } from 'antd';
import UserModal from './components/UserModal';
import { deleteUser, editUser, addUser, getUsers } from './service';
enum userStatus {
  禁用,
  启用,
}

const UserListPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [userListLoading, setUserListLoading] = useState(false);
  const [record, setRecord] = useState<API.User | null>(null);
  const [data, setDate] = useState<API.List['list']>([]);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  type paramType = typeof params;
  const [total, setTotal] = useState(0);
  const handleGetUsers = async function (params: paramType) {
    setUserListLoading(true);
    try {
      const res = await getUsers(params);
      setParams(params);
      setTotal(res.data.total);
      setDate(res.data.list);
    } catch (error) {
      console.log(error);
    }
    setUserListLoading(false);
  };
  useEffect(() => {
    handleGetUsers(params);
  }, []);
  const columns: TableProps<API.User>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '用户状态',
      dataIndex: 'userStatus',
      key: 'userStatus',
      render: (text: any) => <span>{userStatus[text]}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: API.User) => (
        <Space size="middle">
          <a
            onClick={() => {
              handlerEdit(record);
            }}
          >
            编辑
          </a>

          <a
            onClick={() => {
              Modal.confirm({
                title: '确定删除此用户?',
                icon: <ExclamationCircleOutlined />,
                onOk() {
                  return handlerDelete(record.id);
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  const handlerEdit = (record: API.User) => {
    setModalVisible(true);
    setRecord(record);
  };

  const handlerDelete = async (id: string) => {
    try {
      await deleteUser({ id });
      message.success('删除成功');
      await handleGetUsers(params);
    } catch (error) {
      console.log(error);
    }
  };

  const closeHandler = () => {
    setModalVisible(false);
  };

  const onFinish = async (values: API.User) => {
    setConfirmLoading(true);
    let serviceFun;
    if (record?.id) {
      values.id = record.id;
      serviceFun = editUser;
    } else {
      serviceFun = addUser;
    }
    const result = await serviceFun({ ...values });
    if (result.code === 200) {
      setModalVisible(false);
      message.success(`${record?.id ? '添加' : '修改'}成功`);
      setConfirmLoading(false);
      await handleGetUsers(params);
    } else {
      setConfirmLoading(false);
      message.error(`${record?.id ? '添加' : '修改'}失败`);
    }
  };

  const addHandler = () => {
    setModalVisible(true);
    setRecord(null);
  };
  const paginationChange = (page: number, pageSize: number) => {
    if (pageSize !== params.pageSize) return;
    handleGetUsers({ page, pageSize });
  };

  const pageSizeHandler = (current: number, pageSize: number) => {
    handleGetUsers({ page: 1, pageSize });
  };

  return (
    <Layout.Content style={{ margin: '40px' }}>
      <Row justify="center" style={{ margin: '20px 0' }}>
        <Col span={20}>
          <Button onClick={addHandler}>新建用户</Button>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col span={20}>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={userListLoading}
            pagination={{
              total,
              onChange: paginationChange,
              onShowSizeChange: pageSizeHandler,
              current: params.page,
              pageSize: params.pageSize,
            }}
          />
          <UserModal
            visible={modalVisible}
            closeHandler={closeHandler}
            record={record}
            onFinish={onFinish}
            confirmLoading={confirmLoading}
          ></UserModal>
        </Col>
      </Row>
    </Layout.Content>
  );
};

export default UserListPage;
