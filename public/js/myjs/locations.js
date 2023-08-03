var selectData = '';
var dataTable = $('.data-table').DataTable({
    'processing' : true,
    'serverSide' : true,
    'serverMethod' : 'get',
    'ordering':true,
    // 'select':true,
    // 'bFilter':false,
    // 'bInfo':false,
    // 'bPaginate':false,
    'start':2,
    'length':2,
    'ajax' : {
        'data':"json",
        'type':"get",
        'url' : '/admin/locations'
    },
    'aaSorting' : [],
    columnDefs: [
        { "width": "5%", "targets": 0 },
        { "width": "15%", "targets": 1 },
        { "width": "15%", "targets": 2 },
        { "width": "15%", "targets": 3 },
        { "width": "5%", "targets": 4 },
        { "width": "5%", "targets": 5 },
        // { "width": "15%", "targets": 6 },
        { "width": "15%", "targets": 6 },
        { "width": "25%", "targets": 7 },
        
        {
            targets: 0,
            checkboxes: {
                selectRow: true
            }
        },
        {
            orderable: false,
            targets: [0, 7]
        }
    ],
    select: {
        style: 'multi'
    },
    'columns' : [
        { data : 'id',orderable:false,searchable:false },
        { data : 'name', name:'name',orderable:true},
        // { data : 'address' ,name:"address",orderable:true},
        { data : 'phone_number' ,name:"phone_number",orderable:true},
        { data : 'is_full_time',name:'is_full_time',orderable:false,
        render: function (data, type, row, meta) {
            var checked;
            if(row.is_full_time == '1'){
                checked = 'checked';
            }else{
                checked = '';
            }
            return (
                '<div class="text-center custom-control custom-switch custom-switch-off-white custom-switch-on-success">'+
                '<input '+checked+' type="checkbox" class="custom-control-input full-time-toggle full-time-change" value="'+row.is_full_time+'" data-id="'+row.id+'" id="full-time-'+row.id+'">'+
                '<label class="custom-control-label status-label" for="full-time-'+row.id+'"></label>'+
                '</div>'
                );
            },
        },
        { data : 'restricted_access',name:'restricted_access',orderable:false,
        render: function (data, type, row, meta) {
            var checked;
            if(row.restricted_access == '1'){
                checked = 'checked';
            }else{
                checked = '';
            }
            return (
                '<div class="text-center custom-control custom-switch custom-switch-off-white custom-switch-on-success">'+
                '<input '+checked+' type="checkbox" class="custom-control-input restricted-access-toggle restricted-access-change" value="'+row.restricted_access+'" data-id="'+row.id+'" id="restricted-access-'+row.id+'">'+
                '<label class="custom-control-label status-label" for="restricted-access-'+row.id+'"></label>'+
                '</div>'
                );
            },
        }, 
        { data : 'payment_required',name:'payment_required',orderable:false,
        render: function (data, type, row, meta) {
            var checked;
            if(row.payment_required == '1'){
                checked = 'checked';
            }else{
                checked = '';
            }
            return (
                '<div class="text-center custom-control custom-switch custom-switch-off-white custom-switch-on-success">'+
                '<input '+checked+' type="checkbox" class="custom-control-input payment-required-toggle payment-required-change" value="'+row.payment_required+'" data-id="'+row.id+'" id="payment-required-'+row.id+'">'+
                '<label class="custom-control-label status-label" for="payment-required-'+row.id+'"></label>'+
                '</div>'
                );
            },
        },
        // {
        //     data:'total',name:'total'
        // },        
        { data : 'status',
        render: function (data, type, row, meta) {
            var closed = '';
            var verified = '';
            var coming = '';
            var pending = '';
            
            if(row.status == 0){
                closed = 'selected';
            }else if(row.status == 1){
                verified = 'selected';
            }else if(row.status == 2){
                coming = 'selected';
            }else if(row.status == 3){
                pending = 'selected';
            }
            
            return(
                '<select class="form-control status-options" name="status" data-id='+row.id+'>'+
                
                '<option value="0" '+closed+'>Closed</option>'+
                '<option value="1" '+verified+'>Verified</option>'+
                '<option value="2" '+coming+'>Coming Soon</option>'+
                '<option value="3" '+pending+'>Pending</option>'+
                
                '</select>'
                );
                
            },
            orderable:false
        },
        
        {
            targets: 1,
            data: "id",
            render: function (data, type, row, meta) {
                return (
                    // "<a href='javascript:void(0)' class='edit btn btn-sm btn-success' data-id='" +
                    // data + //id is passed to here
                    // "'>" +
                    // '<i class="fa-solid fa-pen-to-square"></i>' + //the name I want to pass to here.
                    // "</a> &nbsp; &nbsp;" +
                    
                    "<a href='javascript:void(0)' class='delete btn btn-sm btn-danger' data-id='" +
                    data + //id is passed to here
                    "'>" +
                    '<i class="fa-solid fa-trash"></i>' + //the name I want to pass to here.
                    "</a> &nbsp; &nbsp;"+
                    
                    "<a href='javascript:void(0)' class='view btn btn-sm btn-primary' data-id='" +
                    data + //id is passed to here
                    "'>" +
                    '<i class="fa-solid fa-eye"></i>' + //the name I want to pass to here.
                    "</a> &nbsp; &nbsp;"
                    );
                },
                orderable:false
            },
        ]
    });
    $('.data-table').wrap('<div class="dataTables_scroll" />');
    
    $(document).on('click','.refresh',function(){
        $('.data-table').DataTable().ajax.reload(null,false);
    });
    
    $(document).on('change','.full-time-toggle',function(){
        
        var id = $(this).data('id');
        
        Swal.fire({
            title: 'Are you sure want to change these record?',
            // text: "You wont be able to undo this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.value == true) {
                $.ajax({
                    type: "patch",
                    url: "/admin/locations/change/full-time-status/"+id,
                    success: function (response) {
                        if(response.status == true){
                            toastr.success(response.message,'Success!');
                        }else{
                            toastr.error(response.error,'Error!')
                        }
                    }
                });
            }else{
                $(this).prop('checked',($(this).is(':checked') == true) ? false : true);
            }
        });
    });
    
    $(document).on('change','.restricted-access-toggle',function(){
        
        var id = $(this).data('id');
        
        Swal.fire({
            title: 'Are you sure want to change these record?',
            // text: "You wont be able to undo this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Change it!'
        }).then((result) => {
            if (result.value == true) {
                $.ajax({
                    type: "patch",
                    url: "/admin/locations/change/restricted-access-toggle/"+id,
                    success: function (response) {
                        if(response.status == true){
                            toastr.success(response.message,'Success!');
                        }else{
                            toastr.error(response.error,'Error!')
                        }
                    }
                });
            }else{
                $(this).prop('checked',($(this).is(':checked') == true) ? false : true);
            }
        });
    });
    
    $(document).on('change','.payment-required-toggle',function(){
        
        var id = $(this).data('id');
        
        Swal.fire({
            title: 'Are you sure want to change these record?',
            // text: "You wont be able to undo this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Change it!'
        }).then((result) => {
            if (result.value == true) {
                $.ajax({
                    type: "patch",
                    url: "/admin/locations/change/payment-required-toggle/"+id,
                    success: function (response) {
                        if(response.status == true){
                            toastr.success(response.message,'Success!');
                        }else{
                            toastr.error(response.error,'Error!')
                        }
                    }
                });
            }else{
                $(this).prop('checked',($(this).is(':checked') == true) ? false : true);
            }
        });
    });
    
    $(document).on('focus click','.status-options',function(){
        selectData = $(this).val();
    });
    
    $(document).on('change','.status-options',function(){
        
        var id = $(this).data('id');
        var status = $(this).val();
        
        Swal.fire({
            title: 'Are you sure want to update these record?',
            // text: "You wont be able to undo this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Update it!'
        }).then((result) => {
            if (result.value == true) {
                $.ajax({
                    type: "put",
                    url: "/admin/locations/change-status/"+id,
                    data:{status},
                    success: function (response) {
                        if(response.status == true){
                            $('.data-table').DataTable().ajax.reload(null,false);
                            toastr.success("Status changed successfully!","Success!");
                        }else{
                            toastr.error("Something went wrong!","Error!");
                        }
                    }
                });
            }else{
                console.log(selectData);
                // $(this).val(selectData).change(); 
                $('.data-table').DataTable().ajax.reload(null,false);
            }
        });
        
    });
    
    $(document).on('click','.view',function(){
        
        var id = $(this).data('id');
        
        $.ajax({
            type: "get",
            url: "/admin/locations/"+id,
            success: function (response) {
                if(response.status == true){
                    $("#name").text(response.data.name);
                    $("#view_user").text(response.data.User.first_name);
                    $("#view_address").text(response.data.address);
                    $("#view_phone").text(response.data.phone_number);
                    $("#view_hour").text(response.data.hours);
                    $("#view_price").text(response.data.price);
                    $("#view_meter").text(response.data.clearance_meter);
                    $("#view_parking_level").text(response.data.parking_level);
                    var yes = 'yes';
                    var no = 'no';
                    if(response.data.is_full_time == true){
                        $("#view_is_full_time").text(yes)
                    }else{
                        $("#view_is_full_time").text(no);
                    }
                    
                    if(response.data.restricted_access == true){
                        $("#view_restricted_access").text(yes)
                    }else{
                        $("#view_restricted_access").text(no);
                    }
                    
                    if(response.data.payment_required == true){
                        $("#view_payment_required").text(yes)
                    }else{
                        $("#view_payment_required").text(no);
                    }
                    
                    var stations = '';
                    var cnt = 1;
                    response.data.Stations.forEach(station => {
                        stations = stations+cnt+".)\n"+"Plug : "+station.Plug.name+"\n"+"Network : "+station.Network.name+"\n\n";
                        cnt ++;
                    });
                    $("#view_station").text(stations);
                    // console.log(response.data.LocationAmenities);
                    var amenities = '';
                    cnt = 1;
                    response.data.LocationAmenities.forEach(amenity =>{
                        amenities = amenities+cnt+".) "+amenity.Amenity.name+"\n"
                        cnt++;    
                    });
                    $("#view_amenities").text(amenities);                   
                    // console.log(response.data.LocationParkingAttributes);
                    cnt = 1;
                    var parkings = '';
                    response.data.LocationParkingAttributes.forEach(parking =>{
                        // console.log(parking.ParkingAttribute.name);
                        parkings = parkings+cnt+".)"+parking.ParkingAttribute.name+"\n"
                        cnt++;
                    });
                    console.log(parkings);
                    $("#view_parking").text(parkings);
                    $("#view_status").text(response.myStatus)
                    $("#view_location_modal").modal('show');
                }else{
                    toastr.error(response.error,'Error!');
                }
            }
        });
        
    });
    
    $(document).on('click','.delete',function(){
        
        var id = $(this).data('id');
        
        Swal.fire({
            title: 'Are you sure want to delete these record?',
            text: "You wont be able to undo this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value == true) {
                $.ajax({
                    type: "delete",
                    url: "/admin/locations/"+id,
                    success: function (response) {
                        if(response.status == true){
                            $('.data-table').DataTable().ajax.reload(null,false);
                            toastr.success(response.message,"Success!");
                        }else{
                            toastr.error(response.error,"Error!");
                        }
                    }
                });
            }
        });
    });

    $('#frm-example').on('submit', function(e) {
        e.preventDefault();
        var rows_selected = dataTable.column(0).checkboxes.selected();
        console.log(rows_selected);
        if (rows_selected.length > 0) {
            Swal.fire({
                title: 'Are you sure want to delete multiple rows?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value == true) {
                    var selected_rows_array = [];
                    $.each(rows_selected, function(index, rowId) {
                        selected_rows_array.push(rowId);
                    });
                    e.preventDefault();
                    $.ajax({
                        type: 'POST',
                        data: {
                            ids: selected_rows_array,
                        },
                        url: "/admin/locations/multiple-delete",
                        
                        beforeSend: function() {
                            $('#multiple_user_delete_loader').show();
                            $("#multiple_delete_btn").prop('disabled', true);
                        },
                        success: function(response) {
                            $('#multiple_user_delete_loader').hide();
                            if (response.status) {
                                dataTable.columns().checkboxes.deselect(true);
                                toastr.success(response.message,"Success!");
                                $('.data-table').DataTable().ajax.reload(null,false);
                            } else {
                                toastr.error(response.message);
                            }
                        },
                        error: function() {
                            $('#multiple_user_delete_loader').hide();
                            $("#multiple_delete_btn").prop('disabled', false);
                            toastr.error('Please Reload Page.');
                        }
                    });
                } else {
                    return false;
                }
            });
        } else {
            toastr.error('Please select atleast any one row');
            e.preventDefault();
        }
    });