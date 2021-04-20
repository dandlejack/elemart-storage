import React from 'react';
import { Input, Button, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

interface ColumnSearch {
  setSelectedKeys: any;
  selectedKeys: any;
  confirm: any;
  clearFilters: string;
  testText: any;
}
const { RangePicker } = DatePicker;
const handleSearch = (selectedKeys: any, confirm: any, data: string) => {
  confirm();
};

const handleReset = (clearFilters: any) => {
  clearFilters();
};

export const addFilter = (dataIndex: any) => ({
    
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: ColumnSearch) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Button
        type="primary"
        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
        icon={<SearchOutlined />}
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        Search
      </Button>
      <Button
        onClick={() => handleReset(clearFilters)}
        size="small"
        style={{ width: 90 }}
      >
        Reset
      </Button>
    </div>
  ),
  filterIcon: (filtered: any) => (
    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value: any, record: any) => {
    if (record[dataIndex] !== undefined) {
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    }
  },
  render: (text: any) => text,
});