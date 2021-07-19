import React, { useContext, useState, useEffect, createRef } from 'react';
import { Select, TimePicker, Form, DatePicker, Radio, Input, InputNumber } from 'antd';
import moment from 'moment';
import TH_LOCAL from 'antd/es/date-picker/locale/th_TH';
import { ProductApi } from '../../api/ProductApi';

interface EditableRowProps {
  index: number;
  d: any;
}

interface Item {
  product: string;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  dataType: string;
  tableType: string;
  record: any;
  handleSave: (record: Item) => void;
  handleDelete: (record: Item) => void;
}

const EditableContext = React.createContext<any>(null);

export const EditableRow: React.FC<EditableRowProps> = ({
  index,
  ...props
}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  dataType,
  tableType,
  record,
  handleSave,
  handleDelete,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [product, setProduct] = useState([] as Array<Object>)
  const inputRef = createRef<Input>();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  useEffect(() => {
    console.log('Effect is applied')
    ProductApi.getAllProductWithoutParams().then(res => {
      setProduct(res.data)
    })
    return () => {
      console.log('unmount')
    }
  }, []);
  const toggleEdit = () => {
    setEditing(!editing);
    if (record[dataIndex] !== '-') {
      if (dataType === 'date') {
        form.setFieldsValue({
          [dataIndex]: moment(record[dataIndex], 'DD/MM/YYYY'),
        });
      } else if (dataType === 'date_time') {
        form.setFieldsValue({
          [dataIndex]: moment(record[dataIndex], 'DD/MM/YYYY HH:mm'),
        });
      } else if (dataType === 'time') {
        form.setFieldsValue({
          [dataIndex]: moment(record[dataIndex], 'HH:mm'),
        });
      } else {
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
      }
    }
  };

  const save = async (e: any) => {
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
    if (editing) {
      if (dataType === 'radio') {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            {dataIndex === 'fruit_size' ? (
              <Radio.Group onChange={save}>
                <Radio value="ใหญ่">ใหญ่</Radio>
                <Radio value="กลาง">กลาง</Radio>
                <Radio value="เล็ก">เล็ก</Radio>
                <Radio value="ชิ้น">ชิ้น</Radio>
              </Radio.Group>
            ) : dataIndex === 'status' ? (
              <Radio.Group onChange={save}>
                <Radio value="สด">สด</Radio>
                <Radio value="เปลี่ยนมุ้ง">เปลี่ยนมุ้ง</Radio>
                <Radio value="คลุก">คลุก</Radio>
                <Radio value="อบใหม่">อบใหม่</Radio>
              </Radio.Group>
            ) : dataIndex === 'soaking_type' ? (
              <Radio.Group onChange={save}>
                <Radio value="บ่อแช่">บ่อแช่</Radio>
                <Radio value="ถัง">ถัง</Radio>
              </Radio.Group>
            ) : dataIndex === 'fruit_path' ? (
              <Radio.Group onChange={save}>
                <Radio value="NORMAL">Normal</Radio>
                <Radio value="SOFT">SOFT</Radio>
                <Radio value="FREE SUGAR">FREE SUGAR</Radio>
                <Radio value="FREE SO2">FREE SO2</Radio>
              </Radio.Group>
            ) : (
                      <Radio.Group onChange={save}>
                        <Radio value="ผ่าน">ผ่าน</Radio>
                        <Radio value="ไม่ผ่าน">ไม่ผ่าน</Radio>
                      </Radio.Group>
                    )}
          </Form.Item>
        );
      } else if (dataType === 'date') {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <DatePicker onBlur={save} format={'DD/MM/YYYY'} locale={TH_LOCAL} />
          </Form.Item>
        );
      } else if (dataType === 'date_time') {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <DatePicker
              onBlur={save}
              showTime
              format={'DD/MM/YYYY HH:mm'}
              locale={TH_LOCAL}
            />
          </Form.Item>
        );
      } else if (dataType === 'time') {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <TimePicker onBlur={save} />
          </Form.Item>
        );
      } else if (dataType === 'select') {
        childNode = (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title} is required.`,
              },
            ]}
          >
            {dataIndex === 'product_name' ? (
              <Select onBlur={save} showSearch>
                {product.length > 0 && product.map((data: any) => {
                  return <Select.Option key={data._id} value={data.product_name}>{data.product_name}</Select.Option>
                })}
              </Select>
            ) : <Select onBlur={save} showSearch>
                {product.length > 0 && product.map((data: any) => {
                  return <Select.Option key={data.product_id} value={data.product_id}>{data.product_id} | <span style={{color:'red'}}>{data.product_name}</span></Select.Option>
                })}
              </Select>}
          </Form.Item>
        );
      } else if (dataType === 'number') {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <InputNumber min={0} ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        );
      } else {
        childNode = (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        );
      }
    } else {
      childNode = (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  }
  return <td {...restProps}>{childNode}</td>;
};
