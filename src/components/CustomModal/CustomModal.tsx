import {ReactChild, useEffect,useState} from 'react'
import {Modal} from 'antd'
import {CustomerForm} from '../CustomerForm/CustomerForm'
interface ModalProps {
    modalTitle:string;
    modalType:string;
    modalVisible:boolean;
    getClose:Function;
    modalForm:ReactChild;
    modalWidth?:number;
}
export const CustomModal:React.FC<ModalProps> = (props) => {
    return <>
    <Modal key='modal-comp' visible={props.modalVisible} title={props.modalTitle} width={props.modalWidth} onCancel={e=>props.getClose(false)} footer={false}>
        {props.modalForm}
    </Modal>
    </>
}