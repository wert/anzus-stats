$(document).ready(function () {
    document.querySelectorAll('[data-toggle="tooltip"]').forEach(function(element){new coreui.Tooltip(element);});

    //setup datatables and remove limit
    $('#table1').DataTable({
        "language": { "search": "" } 
    });
    $("#table1_length").remove();
    $('div.dataTables_filter input').addClass('form-control'); 

    //store oldusername in edits
    $(".badge").click(function (e) {
        e.preventDefault()
        var ids = $(this).attr('data-id');
        var isAdmin = $(this).attr('data-admin');
        var isSLT = $(this).attr('data-slt');
        $("#username").val(ids);
        $("#oldusername").val(ids);
        $("#deleteuser").val(ids);
        $('#adminGroup').prop('checked', isAdmin);
        $('#sltGroup').prop('checked', isSLT);
        $('#sltGroup1').prop('checked', false);
        $("#password").val("*******************");
        $('#createUsername').val('');
        $('#createPassword').val(passg());
        $('#message').html('');
        $('#createMessage').html('');
    });

    //modal buttons
    $(".create").click(function (e) {
        e.preventDefault()
        var user = $("#createUsername").val();
        var pass = $("#createPassword").val();
        var isSLT = $("#sltGroup1").is(':checked');
        var da = {username:user,password:pass,slt:isSLT};
        $.ajax({
            url:'/user/create',
            type:'post',
            data: JSON.stringify(da),
            dataType: "json",
            contentType: 'application/json',    
            beforeSend: function() {
                $("#createMessage").html(``);
            },
            success:function(response){
                if(response.code != 200) {
                    $("#createMessage").html(`<center><p class="btn btn-danger">${response.message}</p></center>`);
                }else {
                    if(response.code === 200) {
                        $("#createMessage").html(`<center><p class="btn btn-success">${response.message}</p></center>`);
                    };
                }
            },
            error: function (request, status, error) {
                console.log(error);
            }
        });
    });
    $(".save").click(function (e) {
        e.preventDefault()
        var ou = $("#oldusername").val();
        var u = $("#username").val();
        var pass = $("#password").val();
        var isAdmin = $("#adminGroup").is(':checked');
        var isSLT = $("#sltGroup").is(':checked');
        var da = {oldusername:ou,newusername:u,slt:isSLT,admin:isAdmin};
        if($("#password").val() != "*******************") {da.password = pass};
        $.ajax({
            url:'/user/update',
            type:'post',
            data: JSON.stringify(da),
            dataType: "json",
            contentType: 'application/json',    
            beforeSend: function() {
                $("#message").html(``);
            },
            success:function(response){
                if(response.code != 200) {
                    $("#message").html(`<center><p class="btn btn-danger">${response.message}</p></center>`);
                }else {
                    if(response.code === 200) {
                        $("#message").html(`<center><p class="btn btn-success">${response.message}</p></center>`);
                    };
                }
            },
            error: function (request, status, error) {
                console.log(error);
            }
        });
    });
    $(".delete").click(function (e) {
        e.preventDefault()
        var ou = $("#deleteuser").val();
        var da = {username:ou};
        $.ajax({
            url:'/user/delete',
            type:'post',
            data: JSON.stringify(da),
            dataType: "json",
            contentType: 'application/json',    
            beforeSend: function() {
                $("#message").html(``);
            },
            success:function(response){
                if(response.code != 200) {
                    $("#message").html(`<center><p class="btn btn-danger">${response.message}</p></center>`);
                }else {
                    if(response.code === 200) {
                        window.location = "/dev/users"
                    };
                }
            },
            error: function (request, status, error) {
                console.log(error);
            }
        });
    });
});
