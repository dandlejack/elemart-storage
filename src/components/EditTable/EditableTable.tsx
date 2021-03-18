import { useEffect, useState } from 'react'
import { Button, Table, Popconfirm } from 'antd'
import {
    EditableCell,
    EditableRow,
} from './EditableCell';
import { TablePaginationConfig } from 'antd/lib/table';

interface TableProps {
    column: Array<Object>;
    getData: Function;
    updateData?: boolean;
    oldData: Array<Object>;
    ablePagination: TablePaginationConfig;
    startCount: number;
}

export const EditableTable: React.FC<TableProps> = props => {
    const [dataSources, setDataSource] = useState(props.oldData)
    const [count, setCount] = useState(props.startCount)

    useEffect(() => {
        dataSources.map((data: any, index: number) => {
            data.key = index + 1
            handleOperation(data);
            return data;
        });
        if (props.getData !== undefined) props.getData(dataSources)
    }, [dataSources])

    const handleOperation = (data: any) => {
        data.operation = (
            <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(data.key)}
            >
                <a style={{ color: 'red' }}>Delete</a>
            </Popconfirm>
        );
        return data.operation
    };

    const handleDelete = (key: number) => {
        setDataSource(dataSources.filter((item: any) => item.key !== key));
        setCount(count - 1)
    };

    const handleSave = (row: any) => {
        const getAllProduct = localStorage.getItem('product')
        if (getAllProduct !== null) {
            const allProductData = JSON.parse(getAllProduct)
            if (row.product_name !== '-') {
                if (allProductData.data) {
                    const filterData = allProductData.data.filter((data: any) => data.product_name === row.product_name)[0]
                    row.raw_id = filterData._id
                    row.product_id = filterData.product_id
                } else {
                    const filterData = allProductData.filter((data: any) => data.product_name === row.product_name)[0]
                    row.raw_id = filterData._id
                    row.product_id = filterData.product_id
                }

            }
        }
        if (row.received_amount) row.total_price = row.received_amount * row.product_price
        if (row.paid_amount) row.total_price = row.paid_amount * row.product_price
        const newData = [...dataSources];
        const index = newData.findIndex((item: any) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const mapColumns = (col: any) => {
        if (!col.editable) {
            return col;
        }
        const newCol = {
            ...col,
            onCell: (record: any) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                children: col.children,
                dataType: col.dataType,
                handleSave,
            }),
        };
        if (col.children) {
            newCol.children = col.children.map(mapColumns);
        }
        return newCol;
    };
    const canEditChildColumns = props.column.map(mapColumns);
    const handleAdd = () => {
        const storeData = {};
        props.column.forEach((data: any) => {
            if (data.children) {
                data.children.forEach((insideChildren: any) => {
                    if (insideChildren.dataType === 'number') {
                        Object.assign(storeData, { [insideChildren.dataIndex]: 0 });
                    } else {
                        Object.assign(storeData, { [insideChildren.dataIndex]: '-' });
                    }
                });
            } else {
                if (data.dataType === 'number') {
                    Object.assign(storeData, { [data.dataIndex]: 0 });
                } else if (data.dataType === 'action') {
                    Object.assign(storeData, { [data.dataIndex]: handleOperation(data) })
                } else {
                    Object.assign(storeData, { [data.dataIndex]: '-' });
                    Object.assign(storeData, { key: count });
                }
            }
        });
        const newData = {
            key: count,
            ...storeData,
        };
        setCount(count + 1);
        setDataSource([...dataSources, newData]);
    }
    const AddBtn = () => {
        return (
            <Button onClick={handleAdd} style={{ marginBottom: 15 }} type='primary'>
                Add row
            </Button>
        );
    };
    return <div>
        <AddBtn />
        <Table
            columns={canEditChildColumns}
            dataSource={dataSources}
            components={components}
            bordered
            style={{ width: '100%' }}
            pagination={props.ablePagination}
        />
    </div>
}