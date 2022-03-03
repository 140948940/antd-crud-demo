import { useEffect } from 'react';
import { Modal, Form, Input, message, Switch } from 'antd';
import type { FC } from 'react';

interface UserModalProps {
  visible: boolean;
  record: API.User | null;
  closeHandler: () => void;
  onFinish: (values: API.User) => void;
  confirmLoading: boolean;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UserModal: FC<UserModalProps> = (props) => {
  const [form] = Form.useForm();
  const { visible, record, closeHandler, onFinish, confirmLoading } = props;

  useEffect(() => {
    if (record === null) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        ...record,
        // createTime: moment(record.createTime),
        userStatus: record.userStatus,
      });
    }
  }, [visible]);

  const onOk = () => {
    form.submit();
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  return (
    <div>
      <Modal
        title={record ? '修改用户: ' + record.username : 'Add'}
        visible={visible}
        onOk={onOk}
        onCancel={closeHandler}
        forceRender
        confirmLoading={confirmLoading}
      >
        <Form
          {...layout}
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            userStatus: 1,
          }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input />
          </Form.Item>
          <Form.Item
            label="用户状态"
            name="userStatus"
            valuePropName="checked"
            getValueFromEvent={(e) => Number(e)}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserModal;
