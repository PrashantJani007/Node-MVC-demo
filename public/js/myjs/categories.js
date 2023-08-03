var dataTable = $('.data-table').DataTable({
    'processing' : true,
    'serverSide' : true,
    'serverMethod' : 'get',
    'ajax' : {
        'data':"json",
        'type':"get",
        'url' : '/admin/categories'
    },
    'aaSorting' : [],
    columnDefs: [
        { "width": "5%", "targets": 0 },
        { "width": "25%", "targets": 1 },
        { "width": "10%", "targets": 2 },
        { "width": "45%", "targets": 3 },
        
        {
            targets: 0,
            checkboxes: {
                selectRow: true
            }
        },
        {
            orderable: false,
            targets: [0, 3]
        }
    ],
    select: {
        style: 'multi'
    },
    'columns' : [
        { data : 'id',orderable:false,searchable:false },
        { data : 'name',name:"name",orderable:true,searchable:true},
        { data : 'status',
        render: function (data, type, row, meta) {
            // console.log(data);
            // console.log(type);
            // console.log(row);
            // console.log(meta);
            var checked;
            if(row.status == '1'){
                checked = 'checked';
            }else{
                checked = '';
            }
            // console.log(checked);
            return (
                '<div class="text-center custom-control custom-switch custom-switch-off-white custom-switch-on-success">'+
                '<input '+checked+' type="checkbox" class="custom-control-input status-toggle status-change" value="'+row.status+'" data-id="'+row.id+'" id="status-'+row.id+'">'+
                '<label class="custom-control-label status-label" for="status-'+row.id+'"></label>'+
                '</div>'
                );
            },
            orderable:false
        },
        
        {
            targets: 1,
            data: "id",
            render: function (data, type, row, meta) {
                return (
                    "<a href='javascript:void(0)' class='edit btn btn-sm btn-success' data-id='" +
                    data + //id is passed to here
                    "'>" +
                    '<i class="fa-solid fa-pen-to-square"></i>' + //the name I want to pass to here.
                    "</a> &nbsp; &nbsp;" +
                    
                    "<a href='javascript:void(0)' class='delete btn btn-sm btn-danger' data-id='" +
                    data + //id is passed to here
                    "'>" +
                    '<i class="fa-solid fa-trash"></i>' + //the name I want to pass to here.
                    "</a> &nbsp; &nbsp;"
                    
                    // "<a href='javascript:void(0)' class='view btn btn-sm btn-primary' data-id='" +
                    // data + //id is passed to here
                    // "'>" +
                    // '<i class="fa-solid fa-eye"></i>' + //the name I want to pass to here.
                    // "</a> &nbsp; &nbsp;"
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
    
    $(document).on('click','.create',function(){
        $(".modal-title").text("Add Category");
        $('.save').val('Add');
        $("#id").val("");
        $('#add_edit_modal').modal('show');
    });
    
    $(document).on('click','.edit',function(){
        
        var id = $(this).data('id');
        
        $.ajax({
            type: "get",
            url: "/admin/categories/"+id,
            success: function (response) {
                if(response.status == true){
                    console.log(response);
                    $("#id").val(response.data.id);
                    $("#name").val(response.data.name);
                    $(".modal-title").text("Edit Category")
                    $("#add_edit_modal").modal('show');
                }
            }
        });
        
    })
    
    $("#add_edit_form").validate({
        rules:{
            name:{
                required:true,
                minlength:2,
                maxlength:100,
                pattern:/\D+/
            }
        },
        messages:{
            name:{
                required:"Please enter category name!",
                minlength:"Atleast 2 characters are required!",
                maxlength:"Category name cannot exceed more than 100 characters!",
                pattern:"Please enter alphabets and spaces only!"
            }
        },
        submitHandler:function(form,e){
            e.preventDefault();
            var formData = new FormData(form);
            console.log(...formData);
            $.ajax({
                type: "post",
                url: "/admin/categories",
                data: formData,
                cache:false,
                contentType:false,
                processData:false,
                success: function (response) {
                    if(response.status == true){
                        $('.data-table').DataTable().ajax.reload();
                        toastr.success(response.message,"Success!")
                        $("#add_edit_modal").modal('hide');
                    }else{
                        toastr.error(response.error,'Error!');
                    }
                },
                error:function(error){
                    var err = JSON.parse(error.responseText)
                    console.log(err);
                    toastr.error(err.error,"Error!");
                }
            });
        },
        
    })
    
    $("#add_edit_modal").on('hidden.bs.modal',function(){
        $("#add_edit_form")[0].reset();
        $("#add_edit_form").validate().resetForm();
        $('#image-show').css("display","none");
        $('#image-show').attr('src',"");
        image=''
    }) 
    
    $(document).on('change','.status-toggle',function(){
        var id = $(this).data('id');
        
        $.ajax({
            type: "patch",
            url: "/admin/categories/change-status/"+id,
            success: function (response) {
                if(response.status == true){
                    toastr.success(response.message,"Success!");
                    $('.data-table').DataTable().ajax.reload(null,false);
                }else{
                    toastr.error(response.message,'Error!');
                }                
            }
        });
    })
    
    $(document).on('click','.refresh',function(){
        $('.data-table').DataTable().ajax.reload(null,false);
    });
    
    $(document).on('click','.delete',function(){
        var id = $(this).data('id');
        
        Swal.fire({
            title: 'Are you sure want to Delete these record?',
            text: "You wont be able to undo this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        }).then((result) => {
            if (result.value == true) {
                $.ajax({
                    type: "delete",
                    url: "/admin/categories/"+id,
                    success: function (response) {
                        if(response.status == true){
                            toastr.success(response.message,"Success!");
                            $('.data-table').DataTable().ajax.reload(null,false);
                        }else{
                            toastr.error(response.message,'Error!');
                        }
                    }
                });
            }
        });
    })
    
    $('#frm-example').on('submit', function(e) {
        e.preventDefault();
        var rows_selected = dataTable.column(0).checkboxes.selected();
        console.log(rows_selected);
        if (rows_selected.length > 0) {
            e.preventDefault();
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
                    // var _token = $("input[name=_token]").val();
                    e.preventDefault();
                    $.ajax({
                        type: 'POST',
                        data: {
                            ids: selected_rows_array,
                        },
                        url:"/admin/categories/multiple-delete",
                        
                        beforeSend: function() {
                            $('#multiple_user_delete_loader').show();
                            $("#multiple_delete_btn").prop('disabled', true);
                        },
                        success: function(response) {
                            $('.data-table').DataTable().ajax.reload();
                            toastr.success(response.message,"Success!")
                            $('#multiple_user_delete_loader').hide();
                            if (response.status) {
                                table.columns().checkboxes.deselect(true);
                                toastr.success(response.message);
                                $('.data-table').DataTable().ajax.reload();
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