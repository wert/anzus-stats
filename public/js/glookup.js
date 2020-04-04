$(document).ready(function(){
    $("#loaderDiv").hide();
    $("#garageStuff").hide();
    $("#searchBtn").click(function(e){
        e.preventDefault()
        var steamid = $("#steamid").val();
        if(steamid != "") {
            $.ajax({
                url:'/garage/lookup',
                type:'post',
                data: JSON.stringify({searchfor: steamid}),
                dataType: "json",
                contentType: 'application/json',    
                beforeSend: function() {
                    $("#loaderDiv").show();
                    $("#mainSearch").hide();
                    $("#garageStuff").hide();
                    $("#message").html("");
                },
                success:function(response){
                    $("#loaderDiv").hide();
                    $("#mainSearch").show();
                    if(response.code === 404) {
                        $("#message").html(`<center><p class="btn btn-danger">${response.message}</p></center>`);
                    }else {
                        if(response.code === 200) {
                            $("#garageStuff").show();

                            console.log(response)
                            $('#garageTable').dataTable( {
                                destroy: true,
                                "language": {
                                    "search": ""
                                },
                                "aaData": response.garage,
                                "columns": [
                                    { "data": "side" },
                                    { "data": "classname" },
                                    { "data": "type" },
                                    { "data": "alive" },
                                    { "data": "active" },
                                    { "data": "impound" },
                                    { "data": "insured" },
                                    { "data": "insert_time" }
                                ]
                            })
                            $("#garageTable_length").remove();
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
    document.getElementById("steamid").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          document.getElementById("searchBtn").click();
        }
      });
});