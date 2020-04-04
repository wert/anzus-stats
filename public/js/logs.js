$(document).ready(function () {
    document.querySelectorAll('[data-toggle="tooltip"]').forEach(function(element){new coreui.Tooltip(element);});

    //setup datatables and remove limit
    $('#table1').DataTable({
        "language": { "search": "" } 
    });
    $("#table1_length").remove();
    $('div.dataTables_filter input').addClass('form-control'); 
});