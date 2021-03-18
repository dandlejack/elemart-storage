export interface Page {
    title:string;
    path:string;
    component?:React.Component | any;
    show:boolean
    privateRoute:boolean
}