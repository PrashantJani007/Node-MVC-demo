ClassicEditor
.create( document.querySelector( '#description' ) )
.then(editor => {
    window.editor = editor;
    YourEditor = editor;
    // validData();
})
.catch( error => {
    console.error( error );
});  

var image = '';

var dataTable = $('.data-table').DataTable({
    'processing' : true,
    'serverSide' : true,
    'serverMethod' : 'get',
    'ajax' : {
        'data':"json",
        'type':"get",
        'url' : '/admin/products'
    },
    'aaSorting' : [],
    columnDefs: [
        { "width": "5%", "targets": 0 },
        { "width": "5%", "targets": 1 },
        { "width": "20%", "targets": 2 },
        { "width": "20%", "targets": 3 },
        { "width": "10%", "targets": 4 },
        { "width": "10%", "targets": 5 },
        { "width": "30%", "targets": 6 },
        {
            targets: 0,
            checkboxes: {
                selectRow: true
            }
        },
        {
            orderable: false,
            targets: [0, 6]
        }
    ],
    select: {
        style: 'multi'
    },
    'columns' : [
        { data : 'id',orderable:false,searchable:false },
        { data : 'image',orderable:false,render:function(data, type, row, meta){
            return '<img src="'+row.image+'" width="70px" height="70px" class="rounded-circle">'
        }},
        { data : 'category_id',name:"category_id",render:function(data, type, row, meta){
            return row.Category.name
        }},       
        { data : 'name', orderable:true, searchable:true,name:"name"},
        { data : 'price', orderable:true, searchable:true,name:"price"},
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
        $('.data-table').DataTable().ajax.reload();
    });
    
    $(document).on('click','.create',function(){
        $(".modal-title").text("Add Product");
        $(".save").val("Add");
        $("#id").val('');
        image=''
        YourEditor.setData('');
        $("#add_edit_modal").modal('show');
    })
    
    $(document).on('change','#image', function(){
        const file = this.files[0];
        
        const FR = new FileReader();
        FR.addEventListener("load", function(evt) {
            FR.result;
        });     
        FR.readAsDataURL(this.files[0]);
        image = FR;
        
        const extensions = ['image/png','image/jpg','image/jpeg','image/gif'];
        if (file){
            if(extensions.includes(file.type)){
                let reader = new FileReader();
                reader.onload = function(event){
                    $('#image-show').css("display","block");
                    $('#image-show').attr('src', event.target.result);
                }
                reader.readAsDataURL(file);   
            }else{
                $('#image-show').css("display","none");
                $('#image-show').attr('src', "");            
            }
        }
    });
    
    $("#add_edit_form").validate({
        rules:{
            // name:{
            //     required:true,
            //     pattern:"[A-Za-z\\s]*",
            //     minlength:3,
            //     maxlength:100
            
            // },
            // price:{
            //     required:true,
            //     pattern:/^\d+(\.\d{1,2})?$/
            // },
            // description:{
            //     required:true
            // },
            // image:{
            //     required:{
            //         depends:function(){
            //             if($("#id").val() == undefined || $("#id").val() == ""){
            //                 return true;
            //             }
            //             else{
            //                 return false;
            //             }
            //         }
            //     },
            //     extension:'jpg|jpeg|png|gif'
            // },
            // category_id:{
            //     required:true
            // }
        },
        messages:{
            name:{
                required:"Please enter product name!",
                minlength:"Product name should be atleast 3 characters!",
                maxlength:"Product name cannot be greater than 100 characters!",
                pattern:"Product name should have alphabets and spaces only!"
            },
            price:{
                required:"Please enter price!",
                number:"Only digits are allowed!",
                pattern:"Price can have value with upto 2 decimal digits!"
            },
            description:{
                required:"Please Provide Description!"
            },
            image:{
                required:"Please Upload Image!",
                extension:'Only This Extensions are allowed jpg, jpeg, png, gif. '
            },
            category_id:{
                required:"Please Select One Category!"
            }
        },
        errorPlacement:function(error,element){
            $("#"+element.attr('name')+"-error").html('&nbsp;'+error.html());
        },
        success:function(label){
            // console.log(label);
        },
        submitHandler:function(form,e){
            e.preventDefault();
            var formData = new FormData(form);
            formData.append('image',image.result)
            $.ajax({
                type: "post",
                url: "/admin/products",
                data: formData,
                cache:false,
                processData:false,
                contentType:false,
                success: function (response) {
                    if(response.status == true){
                        toastr.success(response.message,"Success!")
                        $("#add_edit_modal").modal("hide");
                        $('.data-table').DataTable().ajax.reload(null,false);
                    }else{
                        toastr.error("Something went wrong","Error!")
                    }
                },
                error:function(error){
                    var err = JSON.parse(error.responseText)
                    toastr.error(err.error,"Error!")
                }
            });
        }
    });
    
    $("#add_edit_modal").on('hidden.bs.modal',function(){
        $("#add_edit_form")[0].reset();
        $("#add_edit_form").validate().resetForm();
        $('#image-show').css("display","none");
        $('#image-show').attr('src',"");
        image=''
    }) 
    
    $(document).on('click','.edit',function(){
        var id = $(this).data('id');
        $("#add_edit_form")[0].reset();
        $("#add_edit_form").validate().resetForm();
        $.ajax({
            type: "get",
            url: "/admin/products/"+id,
            success: function (response) {
                if(response.status == true){
                    $(".modal-title").text("Edit Store");
                    $(".save").val("Save Changes");
                    Object.keys(response.data).map(function(key) {
                        if (key != 'image') {
                            $(`#${key}`).val(response.data[key]);
                        }
                    });
                    YourEditor.setData(response.data.description);
                    $("#add_edit_modal").modal('show');
                    $("#id").val(response.data.id)
                    $("#image-show").attr("src",response.data.image);
                    $("#image-show").css('display','block')
                }
            }
        });
    });
    
    $(document).on('change','.status-toggle',function(){
        const id = $(this).data('id');
        
        $.ajax({
            type: "patch",
            url: "/admin/products/change-status/"+id,
            success: function (response) {
                if(response.status == true){
                    toastr.success(response.message,'Success!');
                    $('.data-table').DataTable().ajax.reload(null,false);
                }else{
                    toastr.error("Something went wrong!","Error!");
                }                
            }
        });
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
                    url: "/admin/products/"+id,
                    success: function (response) {
                        if(response.status == true){
                            toastr.success(response.message,"Success!");
                            $('.data-table').DataTable().ajax.reload(null,false);
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
                        url:"/admin/products/multiple-delete",
                        
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

    $(document).on('click','.view',function(){

        var id = $(this).data('id');

        $.ajax({
            type: "get",
            url: "/admin/products/"+id,
            success: function (response) {
                $("#view_image_preview").attr('src',response.data.image);
                $("#product_name").text(response.data.name);
                $("#view_category_name").text(response.data.Category.name);
                $("#view_price").text(response.data.price);
                $("#view_description").html(response.data.description);
                if(response.data.status == 1){
                    $("#view_status").html('<span class="badge badge-success">Active</span>');
                }else if(response.data.status == 0){
                    $("#view_status").html('<span class="badge badge-danger">In-Active</span>');
                }
                $("#view_product_modal").modal('show');
            }
        });

    })
    
    