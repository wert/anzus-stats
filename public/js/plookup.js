$(document).ready(function(){
    $( "#playerInfo" ).hide();
    $("#loaderDiv").hide();
    $("#userLogs").hide();
    $("#searchBtn").click(function(e){
        e.preventDefault()
        var steamid = $("#steamid").val();
        var playername = $("#pname").val();
        if(steamid != "" || playername != "") {
            var dat;
            if(playername != "") {
                dat = {
                    searchfor: playername
                };
            } else if (steamid != "") {
                dat = {
                    searchfor: steamid
                };
            };
            $.ajax({
                url:'/player/lookup',
                type:'post',
                data: JSON.stringify(dat),
                dataType: "json",
                contentType: 'application/json',    
                beforeSend: function() {
                    $("#loaderDiv").show();
                    $('#playerInfo').hide();
                    $("#mainSearch").hide();
                    $("#userLogs").hide();
                    $("#message").html("");
                },
                success:function(response){
                    $("#loaderDiv").hide();
                    $("#mainSearch").show();
                    if(response.code === 404) {
                        $("#username").val("");
                        $("#password").val("");
                        $("#message").html(`<center><p class="btn btn-danger">${response.message}</p></center>`);
                        console.log(response.error)
                    }else {
                        if(response.code === 200) {
                            $("#bguid").html(response.message.bguid)
                            $("#name").html(response.message.name)
                            $("#pid").html(response.message.pid)
                            $("#aliases").html(response.message.aliases)
                            $("#bank").html(response.message.bankacc)
                            $("#cash").html(response.message.cash)
                            $("#exp_total").html(response.message.exp_total)
                            $("#coplvl").html(response.message.coplevel)
                            $("#copdept").html(response.message.copdept)
                            $("#mediclvl").html(response.message.mediclevel)
                            $("#medicdept").html(response.message.medicdept)
                            $("#uscglvl").html(response.message.uscglevel)
                            $("#dojlvl").html(response.message.dojlevel)
                            $("#lseen").html(response.message.last_seen)
                            $("#playerInfo").show();
                            $("#userLogs").show();

                            console.log(response.message)
                            $('#userLogTable').dataTable( {
                                destroy: true,
                                "language": {
                                    "search": ""
                                },
                                "aaData": response.logs,
                                "columns": [
                                    { "data": "time" },
                                    { "data": "pid" },
                                    { "data": "action" },
                                    { "data": "info" }
                                ]
                            })
                            $("#userLogTable_length").remove();
                            $('div.dataTables_filter input').addClass('form-control');
                            console.log(response.message)
                        };
                    }
                }
            });
        } else {
            $("#message").empty();
            $("#message").html(`<center><p class="btn btn-danger">One field must be complete</p></center>`);
        }
    });

    document.getElementById("pname").addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("searchBtn").click();
      }
    }); 
    document.getElementById("steamid").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          document.getElementById("searchBtn").click();
        }
      });
});
