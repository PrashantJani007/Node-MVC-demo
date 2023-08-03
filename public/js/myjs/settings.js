$("#add_edit_form").validate({
    rules:{
        coffee_points:{
            required:true,
            digits:true,
            maxlength:10
        },
        gold_limit:{
            required:true,
            digits:true,
            maxlength:10
        },
        silver_limit:{
            required:true,
            digits:true,
            maxlength:10
        },
        bronze_limit:{
            required:true,
            digits:true,
            maxlength:10
        },
        gold_discount_percent:{
            required:true,
            digits:true,
            maxlength:10
        },
        silver_discount_percent:{
            required:true,
            digits:true,
            maxlength:10
        },
        bronze_discount_percent:{
            required:true,
            digits:true,
            maxlength:10
        },
        expiry_time:{
            required:true,
            digits:true,
            maxlength:10
        }
    },
    messages:{
        coffee_points:{
            required:"Please Enter Coffee Points!",
            digits:"Value Should Be Integer Only!",
            maxlength:"Value should not be more than 10 digits!"
        },
        gold_limit:{
            required:"Please Enter Gold Threshold!",
            digits:"Value Should Be Integer Only!",
            maxlength:"Value should not be more than 10 digits!"
        },
        silver_limit:{
            required:"Please Enter Silver Threshold!",
            digits:"Value Should Be Integer Only!",
            maxlength:"Value should not be more than 10 digits!"
        },
        bronze_limit:{
            required:"Please Enter Bronze Threshold!",
            digits:"Value Should Be Integer Only!",
            maxlength:"Value should not be more than 10 digits!"
        },
        gold_discount_percent:{
            required:"Please Enter Gold Discount Percentage!",
            digits:"Value Should Be Integer Only!",
            maxlength:"Value should not be more than 10 digits!"
        },
        silver_discount_percent:{
            required:"Please Enter Silver Discount Percentage!",
            digits:"Value Should Be Integer Only!",
            maxlength:"Value should not be more than 10 digits!"
        },
        bronze_discount_percent:{
            required:"Please Enter Bronze Discount Percentage!",
            digits:"Value Should Be Integer Only!",
            maxlength:"Value should not be more than 10 digits!"
        },
        expiry_time:{
            required:"Please Enter Expire Time!",
            digits:"Value Should Be Integer Only!",
            maxlength:"Value should not be more than 10 digits!"
        }
    },
    submitHandler:function(form){
        // e.preventDefault();
        var formData = new FormData(form);
        $.ajax({
            type: "post",
            url: "/admin/settings",
            data: formData,
            cache:false,
            processData:false,
            contentType:false,
            success: function (response) {
                if(response.status == false){
                    toastr.error(response.message,"Error!")
                }else{
                    toastr.success(response.message,"Success!")
                }
            },
            error:function(error){
                var err = JSON.parse(error.responseText);
                toastr.error(err.errors,"Error!")
            }
        });
    }
});