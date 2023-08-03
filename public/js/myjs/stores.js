var image = '';
var dataTable = $('.data-table').DataTable({
    'processing' : true,
    'serverSide' : true,
    'serverMethod' : 'get',
    'ajax' : {
        'data':"json",
        'type':"get",
        'url' : '/admin/stores'
    },
    'aaSorting' : [],
    columnDefs: [
        { "width": "5%", "targets": 0 },
        { "width": "5%", "targets": 1 },
        { "width": "10%", "targets": 2 },
        { "width": "5%", "targets": 3 },
        { "width": "5%", "targets": 4 },
        { "width": "10%", "targets": 5 },
        { "width": "25%", "targets": 6 },
        { "width": "5%", "targets": 7 },
        { "width": "30%", "targets": 8 },
        
        {
            targets: 0,
            checkboxes: {
                selectRow: true
            }
        },
        {
            orderable: false,
            targets: [0, 4]
        }
    ],
    select: {
        style: 'multi'
    },
    'columns' : [
        { data : 'id',orderable:false,searchable:false },
        { data : 'image',orderable:false,searchable:false,render:function(data,type,row,meta){
            return '<img width="70px" height="50px" src="'+row.image+'">'
        } },
        { data : 'name',orderable:true,searchable:true,name:"name"},
        { data : 'open_time',orderable:true,searchable:true ,name:"open_time"},
        { data : 'close_time',orderable:true,searchable:true ,name:"close_time"},
        { data : 'mobile_number',orderable:true,searchable:true ,name:"mobile_number"},
        { data : 'city',orderable:false,searchable:true,render:function(data,type,row,meta){
            return row.street+","+row.city+","+row.state
        }},
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
        $(".modal-title").text("Add Store");
        $('.save').val('Add');
        $("#id").val("");
        YourEditor.setData("");
        $('#add_edit_modal').modal('show');
    })
    
    $(document).ready(function(){
        var a = "02/03/2023 7:00 am";
        var b = "02/03/2023 12:00 am";
        
        var aDate = new Date(a).getTime();
        var bDate = new Date(b).getTime();
        
        console.log(aDate < bDate);
        
        $('#open_time').timepicker({
            template:'modal',
            timeFormat: 'H:i a',
            scrollDefault: 'now',
            minTime: '12:00 am',
            interval:'5'
        });
        $('#close_time').timepicker({
            template:'modal',
            timeFormat: 'H:i a',
            scrollDefault: 'now',
            minTime: '12:00 am',
            interval:'5'
        });
    });
    
    ClassicEditor
    .create( document.querySelector( '#description' ) )
    .then(editor => {
        window.editor = editor;
        YourEditor = editor;
        // validData();
    })
    .catch( error => {
        console.error( error );
    } );     
    
    $(document).on('change',"#close_time, #open_time",function(){
        var open_time = $("#open_time").val();
        var close_time = $("#close_time").val();
        if(open_time == undefined || open_time == ""){
            toastr.error('Please select open time!',"Error");
        }else if(close_time == undefined || close_time == ""){
            
        }
        else{
            var opening_time = new Date("November 13, 2013 " + open_time);
            console.log(opening_time.getHours);
            opening_time = opening_time.getTime();

            var closing_time = new Date("November 13, 2013 " + close_time);
            closing_time = closing_time.getTime();

            console.log(closing_time);
            console.log(opening_time);

            if(closing_time <= opening_time){
                toastr.error("Store opening time cannot be more or equal to closing time!","Error");
            }
        }
    });
    
    $(document).on('click','.close-btn, .cross',function(){
        $("#add_edit_form :input").prop("disabled", false);
    });    
    
    $("#add_edit_modal").on('hidden.bs.modal',function(){
        $("#add_edit_form")[0].reset();
        $("#add_edit_form").validate().resetForm();
        $('#image-show').css("display","none");
        $('#image-show').attr('src',"");
        image=''
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
        ignore: [],
        rules:{
            name:{
                required:true,
                pattern:/\D+/,
                minlength:3,
                maxlength:60
            },
            open_time:{
                required:true,
            },
            close_time:{
                required:true,
            },
            mobile_number:{
                required:true,
                digits:true,
                minlength:10,
                maxlength:10
            },
            street:{
                required:true,
                pattern:/\D+/,
                minlength:6,
                maxlength:100,
            },
            city:{
                required:true,
                pattern:"[A-Za-z\\s]*",
                minlength:3,
                maxlength:100
            },
            state:{
                required:true,
                pattern:"[A-Za-z\\s]*",
                minlength:3,
                maxlength:100
            },
            zip_code:{
                required:true,
                digits:true,
                minlength:5,
                maxlength:5
            },
            description:{
                required:true
            },
            image:{
                required:function(){
                    if($("#id").val() == undefined || $("#id").val() == ""){
                        return true;
                    }else{
                        return false;
                    }
                },
                extension:"png|jpg|jpeg|gif"
            }  
        },
        messages:{
            name:{
                required:"Please Enter Store Name!",
                minlength:"Atleast 3 characters required!",
                maxlength:"Store name cannot be greater than 60 characters!",
                pattern:"Store name should have alphabets and spaces only!"
            },
            open_time:{
                required:"Please Select Store Opening Time!",
            },
            close_time:{
                required:"Please Select Store Closing Time!",                       
            },
            mobile_number:{
                required:"Please Enter Mobile Number",
                digits:"Mobile number should have numbers only!",
                minlength:"Minimum 10 digits are requried!",
                maxlength:"Maximum 10 digits are allowed!"
            },
            street:{
                required:"Please Enter Street Name",
                minlength:"Atleast 6 characters required!",
                maxlength:"Store name cannot be greater than 100 characters!",
                pattern:"Please enter street address in proper format!Only numbers are not allowed."
            },
            city:{
                required:"Please Enter City Name",
                minlength:"Atleast 3 characters required!",
                maxlength:"Store name cannot be greater than 100 characters!",
                pattern:"City name should have alphabets and spaces only!"
            },
            state:{
                required:"Please Enter State Name",
                minlength:"Atleast 3 characters required!",
                maxlength:"Store name cannot be greater than 100 characters!",
                pattern:"State name should have alphabets and spaces only!"
            },
            zip_code:{
                required:"Please Enter Zip Code!",
                digit:"Zip code should have digits only!",
                minlength:"Zip code should have 5 digits only",
                maxlength:"Zip code should have 5 digits only"
            },
            image:{
                required:"Please upload store image!",
                extension:"Only png, jpg, jpeg and gif extensions are supported!"
            },
            description:{
                required:"Please enter store description!",
            }  
        },
        errorPlacement:function(error,element){
            $("#"+element.attr('name')+"-error").html('&nbsp;'+error.html());
        },
        success:function(label){
            
        },
        submitHandler: function(form,e){
            e.preventDefault();
            // var store_id = $("#store_id").val();
            var formData = new FormData(form)
            formData.append('image',image.result);
            console.log(...formData);
            
            $.ajax({
                url:"/admin/stores",
                enctype: 'multipart/form-data',
                type:"post",
                data: formData,
                processData: false,
                cache:false,
                contentType:false,
                success:function(response){
                    if(response.status == true){
                        toastr.success(response.message,"Success")
                        $("#add_edit_modal").modal("hide");
                        $('.data-table').DataTable().ajax.reload();
                    }else{
                        toastr.error(response,"Error");
                    }
                },
                error:function(error){
                    console.log("saj");
                    var err = JSON.parse(error.responseText);
                    console.log(err);
                    toastr.error(err.error,"Error");
                }
            });
            return false;
        }
    });
    
    $(document).on('click','.edit',function(){
        var id = $(this).data('id');
        
        $.ajax({
            type: "get",
            url: "/admin/stores/"+id,
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
                    $("#image-show").attr('src',response.data.image)
                    $("#image-show").css('display','block')
                    $("#add_edit_modal").modal('show');
                    $("#id").val(response.data.id);
                }else{
                    toastr.error('Something went wrong!',"Error!");
                }
            },
            error:function(error){
                var err = JSON.parse(error.responseText);
                toastr.error(err.error,"Error!")
            }
        });
    })
    
    $(document).on('change','.status-toggle',function(){
        var id = $(this).data('id');
        
        $.ajax({
            type: "patch",
            url: "/admin/stores/change-status/"+id,
            success: function (response) {
                if(response.status == true){
                    toastr.success(response.message,"Success!");
                    $('.data-table').DataTable().ajax.reload();
                }
            },
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
                    url: "/admin/stores/"+id,
                    success: function (response) {
                        if(response.status == true){
                            toastr.success(response.message,"Success!");
                            $('.data-table').DataTable().ajax.reload();
                        }else{
                            toastr.error("Something went wrong","Error!");
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
                        url:"/admin/stores/multiple-delete",
                        
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
            url: "/admin/stores/"+id,
            success: function (response) {
                console.log(response);
                if(response.status == true){
                    $("#view_image_preview").attr('src',response.data.image)
                    $("#store_name").text(response.data.name)
                    if(response.data.User != null){
                        $("#view_owner").text(response.data.User.first_name+" "+response.data.User.last_name)
                    }
                    $("#view_open_time").text(response.data.open_time);
                    $("#view_close_time").text(response.data.close_time);
                    $("#view_mobile_number").text(response.data.mobile_number);
                    $("#view_address").text(response.data.street+","+response.data.city+","+response.data.state);
                    $("#view_description").html(response.data.description)
                    if(response.data.status == 1){
                        $("#view_status").html('<span class="badge badge-success">Active</span>')
                    }else if(response.data.status == 0){
                        $("#view_status").html('<span class="badge badge-danger">In-Active</span>')
                    }
                    $("#view_store_modal").modal('show');
                }else{
                    toastr.error('Something went wrong','Error!');
                }                
            }
        });
    })