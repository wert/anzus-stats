$(document).ready(function(){
    $("#loginBtn").click(function(e){
        e.preventDefault()
        var username = $("#username").val();
        var password = $("#password").val();
        console.log("activated")
        if(username != "" && password != ""){
            var dat = {
                username: username,
                password: password
            };
            $.ajax({
                url:'/user/login',
                type:'post',
                data: JSON.stringify(dat),
                dataType: "json",
                contentType: 'application/json',    
                beforeSend: function() {
                    $("#message").html("");
                },
                success:function(response){
                    if(response.code === 403) {
                        $("#username").val("");
                        $("#password").val("");
                        $("#message").html(`<center><p class="btn btn-danger">${response.message}</p></center>`);
                    }else {
                        if(response.code === 200) {
                            window.location = "/";
                        };
                    }
                }
            });
        } else {
            $("#message").empty();
            $("#message").html(`<center><p class="btn btn-danger">Fields cannot be null</p></center>`);
        }
    });
    document.getElementById("password").addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("loginBtn").click();
      }
    }); 
    document.getElementById("username").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          document.getElementById("loginBtn").click();
        }
      });
});
