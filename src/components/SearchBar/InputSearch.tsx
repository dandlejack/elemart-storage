import { Input, Select } from 'antd'
import React, { ReactText } from 'react'
interface IInputProps {
    selectType: Array<string>;
    thaiwordSelect: Array<string>;
}
export const InputSearch: React.FC<IInputProps> = ({ selectType, thaiwordSelect }) => {
    return <>
        
        <Select defaultValue={selectType[0]}>
            {selectType.map((data: string, index: number) => {
                return <Select.Option value={data}>{thaiwordSelect[index]}</Select.Option>
            })}
        </Select>
        <Input style={{ width: 200, marginRight: 15 }} />
    </>
}