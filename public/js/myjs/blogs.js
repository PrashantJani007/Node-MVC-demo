$(document).on('click','.create',function(){
    
    $(".modal-title").text('Add Blog');
    $("#add_edit_modal").modal('show');
    $("#category").val('');
    $("#category").trigger('change');
    $("#tag").val('');
    $("#tag").trigger('change'); 
    $(".save").val('Add');
    // console.log($("#id").val());
});

var YourEditor;

ClassicEditor
.create( document.querySelector( '#description' ),{
    ckfinder: {
        uploadUrl:'/upload'
    }
} )
.then(editor => {
    window.editor = editor;
    YourEditor = editor;
    // validData();
})
.catch( error => {
    alert(error);
    // console.error( error );
});  


$('.category').select2({
    placeholder: "Please select blog categories",
    allowClear: true
});

$('.tag').select2({
    placeholder: "Please select blog tags",
    allowClear: true
});

var image = '';
var flag = 0;

function loadMime(file,callback) {
    
    //List of known mimes
    var mimes = [
        {
            mime: 'image/jpeg',
            pattern: [0xFF, 0xD8, 0xFF],
            mask: [0xFF, 0xFF, 0xFF],
        },
        {
            mime: 'image/png',
            pattern: [0x89, 0x50, 0x4E, 0x47],
            mask: [0xFF, 0xFF, 0xFF, 0xFF],
        }
        // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
    ];
    
    function check(bytes, mime) {
        for (var i = 0, l = mime.mask.length; i < l; ++i) {
            if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
                return false;
            }
        }
        return true;
    }
    
    var blob = file.slice(0, 4); //read the first 4 bytes of the file
    
    var reader = new FileReader();
    reader.onloadend = function(e) {
        if (e.target.readyState === FileReader.DONE) {
            var bytes = new Uint8Array(e.target.result);
            for (var i=0, l = mimes.length; i<l; ++i) {
                // if (check(bytes, mimes[i])) console.log("Mime: " + mimes[i].mime + " <br> Browser:" + file.type);
                if (check(bytes, mimes[i])){
                    flag = 1;
                    return callback(flag);
                };
            }
            flag = 0;
            return callback(flag);
        }
    };
    reader.readAsArrayBuffer(blob);
}

$(document).on('change','#image', function(){
    const file = this.files[0];
    
    loadMime(this.files[0],function(myFlag){
        console.log(myFlag,"dassd");
    });
    
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

$("#add_edit_modal").on('hidden.bs.modal',function(){
    $("#add_edit_form")[0].reset();
    $("#add_edit_form").validate().resetForm();
    
    YourEditor.setData('');
    $('#image-show').css("display","none");
    $('#image-show').attr('src',"");
    image=''
    flag = 0;
    $.ajax({
        type: "delete",
        url: "/remove-extra-blog-image",
        success: function (response) {
            
        }
    });
}); 

$("#add_edit_form").validate({
    ignore: [],
    rules:{
        title:{
            required:true,
            pattern:"[A-Za-z\\s]*",
            minlength:3,
            maxlength:100
        },
        'category[]':{
            required:true,
        },
        description:{
            required:true
        },
        'tag[]':{
            required:true
        },
        image:{
            required:{
                depends:function(){
                    if($("#id").val() == undefined || $("#id").val() == ""){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            },
            extension:'jpg|jpeg|png|gif'
        },
    },
    messages:{
        title:{
            required:"Please enter blog title!",
            minlength:"Blog title should be atleast 3 characters!",
            maxlength:"Blog title cannot be greater than 100 characters!",
            pattern:"Blog title should have alphabets and spaces only!"
        },
        'category[]':{
            required:"Please select category!",
        },
        'tag[]':{
            required:"Please select tag!",
        },
        description:{
            required:"Please Provide Description!"
        },
        image:{
            required:"Please Upload Image!",
            extension:'Only This Extensions are allowed jpg, jpeg, png, gif. '
        },
    },
    // errorPlacement:function(error,element){
    //     $("#"+element.attr('name')+"-error").html('&nbsp;'+error.html());
    // },
    // success:function(label){
    //     // console.log(label);
    // },
    
    submitHandler:function(form,e){
        e.preventDefault();
        var formData = new FormData(form);
        formData.append('image',image.result)
        if(flag == 1){
            $.ajax({
                type: "post",
                url: "/admin/blogs",
                data: formData,
                cache:false,
                processData:false,
                contentType:false,
                success: function (response) {
                    if(response.status == true){
                        toastr.success(response.message,"Success!")
                        $("#add_edit_modal").modal("hide");
                        $('.data-table').DataTable().ajax.reload(null,false);
                        $("#id").val('');
                    }else{
                        $("#id").val('');
                        toastr.error("Something went wrong","Error!")
                    }
                },
                error:function(error){
                    $("#id").val('');
                    var err = JSON.parse(error.responseText)
                    toastr.error(err.error,"Error!")
                }
            });
        }else{
            toastr.error("In-valid image","Error!");
        }
    }
});

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
        'url' : '/admin/blogs'
    },
    'aaSorting' : [],
    columnDefs: [
        { "width": "5%", "targets": 0 },
        { "width": "15%", "targets": 1 },
        { "width": "15%", "targets": 2 },
        { "width": "5%", "targets": 3 },
        { "width": "20%", "targets": 4 },
        { "width": "5%", "targets": 5 },
        { "width": "20%", "targets": 6 },
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
        { data : 'image', name:'image',orderable:false,searchable:false,render:function(data,type,row,meta){
            return '<img src = '+row.image+' width="50px" height="50px" class="rounded-circle">'        
        }
    },
    { data : 'title' ,name:"title",orderable:true},
    { data : 'visit_count' ,name:"visit_count",orderable:true},
    {
        data:'created_at',name:'created_at',orderable:true,searchable:true,render:function(data,type,row,meta){
            var date = row.created_at;
            var momentDate = moment(date).format('MMMM D YYYY h:mm:ss a')
            return momentDate;
        }
    },
    { data : 'status',name:'status',orderable:false,
    render: function (data, type, row, meta) {
        var checked;
        if(row.status == '1'){
            checked = 'checked';
        }else{
            checked = '';
        }
        return (
            '<div class="text-center custom-control custom-switch custom-switch-off-white custom-switch-on-success">'+
            '<input '+checked+' type="checkbox" class="custom-control-input status-toggle status-change" value="'+row.status+'" data-id="'+row.id+'" id="status-'+row.id+'">'+
            '<label class="custom-control-label status-label" for="status-'+row.id+'"></label>'+
            '</div>'
            );
        },
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

$(document).on('change','.status-toggle',function(){
    
    var id = $(this).data('id');
    
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
                type: "patch",
                url: "/admin/blogs/change-status/"+id,
                success: function (response) {
                    if(response.status == true){
                        $('.data-table').DataTable().ajax.reload(null,false);
                        toastr.success(response.message,"Success!");
                    }else{
                        toastr.error(response.error,"Error!");
                    }
                }
            });
        }else{
            $(this).prop('checked',($(this).is(':checked') == true) ? false : true);
        }
    });
})

$(document).on('click','.refresh',function(){
    $('.data-table').DataTable().ajax.reload();
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
                url: "/admin/blogs/"+id,
                success: function (response) {
                    if(response.status == true){
                        $('.data-table').DataTable().ajax.reload(null,false);
                        toastr.success(response.message,'Success!');
                    }else{
                        toastr.error('Something went wrong!','Error!');
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
                    url: "/admin/blogs/multiple-delete",
                    
                    beforeSend: function() {
                        $('#multiple_user_delete_loader').show();
                        $("#multiple_delete_btn").prop('disabled', true);
                    },
                    success: function(response) {
                        $('#multiple_user_delete_loader').hide();
                        if (response.status) {
                            dataTable.columns().checkboxes.deselect(true);
                            toastr.success(response.message,"Success!");
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

$(document).on('click','.edit',function(){
    
    var id = $(this).data('id');
    flag = 1;
    $.ajax({
        type: "get",
        url: "/admin/blogs/"+id,
        success: function (response) {
            if(response.status == true){
                console.log(response.data);
                $("#title").val(response.data.title);
                $("#id").val(response.data.id);
                // YourEditor.setData(response.data.description);
                YourEditor.setData(response.data.description)
                
                response.data.BlogCategories.forEach(element => {
                    $(".category option").each(function(){
                        if($(this).val() == element.Category.id){
                            $(this).prop('selected',true);
                            $(this).trigger('change');
                        }
                    });
                });
                
                response.data.BlogTags.forEach(element => {
                    $(".tag option").each(function(){
                        if($(this).val() == element.Tag.id){
                            $(this).prop('selected',true);
                            $(this).trigger('change');
                        }
                    });
                });
                
                $('.modal-title').text('Update Blog');
                $("#image-show").attr('src',response.data.image);
                $("#image-show").css('display','block');
                $(".save").val('Save changes');
                $("#add_edit_modal").modal('show');
                
            }else{
                toastr.error(response.error,'Error!');
            }
        }
    });
    
});

$(document).on('click','.view',function(){
    
    var id = $(this).data('id');
    
    $.ajax({
        type: "get",
        url: "/admin/blogs/"+id,
        success: function (response) {
            
            $("#view_image_preview").attr('src',response.data.image);
            $("#name").text(response.data.title);
            $("#view_description").html(response.data.description);
            $("#view_visit").text(response.data.visit_count);
            if(response.data.status == 1){
                $("#view_status").html('<span class="badge badge-success">Active</span>');
            }else{
                $("#view_status").html('<span class="badge badge-danger">In-Active</span>');
            }
            
            var categories = '';
            response.data.BlogCategories.forEach(element=>{
                categories = categories + element.Category.name+', ';
            });
            
            var tags = '';
            response.data.BlogTags.forEach(element=>{
                tags = tags + element.Tag.name+', ';
            });
            
            $("#view_categories").text(categories);
            $("#view_tags").text(tags);
            
            $("#view_blog_modal").modal("show");
        }
    });
    
});

