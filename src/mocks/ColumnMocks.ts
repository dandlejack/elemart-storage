export const paidColumn = [
    {
        title: 'รหัสสินค้า',
        dataIndex: 'product_id',
        key: 'product_id',
        dataType: 'select',
        width:140,
        editable: true
    },
    {
        title: 'ชื่อสินค้า',
        dataIndex: 'product_name',
        dataType: 'select',
        key: 'product_name',
        width:250,
    },
    {
        title: 'จำนวน',
        dataIndex: 'paid_amount',
        dataType: 'number',
        key: 'paid_amount',
        width:140,
        editable: true
    },
    {
        title: 'ราคา',
        dataIndex: 'product_price',
        dataType: 'number',
        key: 'product_price',
        width:140,
        editable: true
    },
    {
        title: 'จำนวนเงิน',
        dataIndex: 'total_price',
        dataType: 'number',
        key: 'total_price',
        width:140,
    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        dataType: 'action',
        key: 'operation',
        width:100,
        // render:(text:string,record:object)=><a>Delete</a>
    }
]

export const receivedColumn = [
    {
        title: 'รหัสสินค้า',
        dataIndex: 'product_id',
        key: 'product_id',
        dataType: 'select',
        width:140,
        editable: true
    },
    {
        title: 'ชื่อสินค้า',
        dataIndex: 'product_name',
        dataType: 'select',
        key: 'product_name',
        width:250,
        // editable: true
    },
    {
        title: 'จำนวน',
        dataIndex: 'received_amount',
        dataType: 'number',
        key: 'received_amount',
        width:140,
        editable: true
    },
    {
        title: 'ราคา',
        dataIndex: 'product_price',
        dataType: 'number',
        key: 'product_price',
        width:140,
        editable: true
    },
    {
        title: 'จำนวนเงิน',
        dataIndex: 'total_price',
        dataType: 'number',
        key: 'total_price',
        width:140,
    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        dataType: 'action',
        key: 'operation',
        width:100,
        // render:(text:string,record:object)=><a>Delete</a>
    }
]

export const productDetailColumn = [
    {
        title: 'วันที่',
        dataIndex: 'invoice_date',
        key: 'invoice_date',
    },
    {
        title: 'หมายเลข invoice',
        dataIndex: 'invoice_id',
        dataType: 'select',
        key: 'invoice_id',
        editable: true
    },
    {
        title: 'ซื้อ',
        dataIndex: 'received_amount',
        dataType: 'number',
        key: 'received_amount',
        editable: true
    },
    {
        title: 'ขาย',
        dataIndex: 'paid_amount',
        dataType: 'number',
        key: 'paid_amount',
        editable: true
    },
    {
        title: 'ราคา',
        dataIndex: 'product_price',
        dataType: 'number',
        key: 'product_price',
        editable: true
    },
    {
        title: 'จำนวนเงิน',
        dataIndex: 'total_price',
        dataType: 'number',
        key: 'total_price',
        width:140,
    },
]

export const mergeAllInvoice = [
    {
        title: 'วันที่',
        dataIndex: 'invoice_date',
        key: 'invoice_date',
    },
    {
        title: 'หมายเลข invoice',
        dataIndex: 'invoice_id',
        dataType: 'select',
        key: 'invoice_id',
        editable: true
    },
    {
        title: 'ประเภท',
        dataIndex: 'invoice_type',
        key: 'invoice_type',
    },
    {
        title: 'รหัสสินค้า',
        dataIndex: 'product_id',
        key: 'product_id',
    },
    {
        title: 'ชื่อสินค้า',
        dataIndex: 'product_name',
        dataType: 'select',
        key: 'product_name',
    },
    {
        title: 'ซื้อ',
        dataIndex: 'received_amount',
        dataType: 'number',
        key: 'received_amount',
    },
    {
        title: 'ขาย',
        dataIndex: 'paid_amount',
        dataType: 'number',
        key: 'paid_amount',
    },
    {
        title: 'ราคา',
        dataIndex: 'product_price',
        dataType: 'number',
        key: 'product_price',
    },
    {
        title: 'จำนวนเงิน',
        dataIndex: 'total_price',
        dataType: 'number',
        key: 'total_price',
    },
]