var dataTable = $('.data-table').DataTable({
    'processing' : true,
    'serverSide' : true,
    'serverMethod' : 'get',
    'ajax' : {
        'data':"json",
        'type':"get",
        'url' : '/admin/orders'
    },
    'aaSorting' : [],
    columnDefs: [
        { "width": "5%", "targets": 0 },
        { "width": "15%", "targets": 1 },
        { "width": "10%", "targets": 2 },
        { "width": "20%", "targets": 3 },
        { "width": "10%", "targets": 4 },
        { "width": "10%", "targets": 5 },
        // {
        //     targets: 0,
        //     checkboxes: {
        //         selectRow: true
        //     }
        // },
        {
            orderable: false,
            targets: [0, 5]
        }
    ],
    // select: {
    //     style: 'multi'
    // },
    'columns' : [
        { data : 'id',orderable:true,searchable:false ,name:"id" },
        { data : 'store_id',orderable:false,searchable:false,
        render:function(data,type,row,meta){
            return row.Store.name;
        }
    },
    { data : 'total',orderable:true,searchable:false,name:"total",
    render:function(data,type,row,meta){
        return `<b>$${row.total}</b>`
    }    
},
{ data : 'created_at',orderable:true,searchable:false,name:"created_at",
render:function(data,type,row,meta){
    var date = row.created_at;
    var momentDate = moment(date).format('h:mm:ss a MMMM D YYYY')
    return momentDate;
}
},
{ data : 'status',orderable:false,searchable:false },
{
    targets: 1,
    data: "id",
    render: function (data, type, row, meta) {
        return (
            '<a href="javascript:void(0)" class="btn btn-success view" data-id='+row.id+'><i class="fa-solid fa-eye"></i></a>' + //the name I want to pass to here.
            "</a> &nbsp; &nbsp;"
            );
        },
        orderable:false
    },
]
});
$('.data-table').wrap('<div class="dataTables_scroll" />');

$(document).on('click','.refresh',function(){
    $('.data-table').DataTable().ajax.reload();
});

$(document).on('click','.view',function(){
    var id = $(this).data('id');
    
    $.ajax({
        type: "get",
        url: "/admin/orders/"+id,
        success: function (response) {
            if(response.status == true){
                console.log(response.data);
                $(".user-name").text(response.data.User.first_name+"'s Order");
                $(".user-mobile").text("Mo."+response.data.User.mobile_number);
                $("#loop").html(response.html)
                $(".total").text("$ "+response.data.total)
                $(".gross-total").text("$ "+response.data.gross_amount)
                if(response.data.discount == null){
                    $(".discount").text("$ 0")
                }
                else{
                    $(".discount").text("$ "+response.data.discount)
                }
                $("#view_modal").modal('show');
            }else{
                toastr.error('Something went wrong!','Error!');
            }
        }
    });
})