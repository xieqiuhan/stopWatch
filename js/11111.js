$(document).ready(function () {

    var timer;
    var value = $('#para').val();
    $("#submit").click(function () {

        var value = $('#para').val();
        var name = $('#id').val();

        var token = $("#token").val();

        var force_str = ($('#force').is(":checked")) ? "1" : "0";
        var uid = (name == "userId") ? value : "";
        var firmid = (name == "firmId") ? value : "";

        var jsonStr = (uid == "") ? ({
            "firms": [firmid],
            "token": [token],
            "force_str": ["1"]
        }) : ({
            "lists": [uid],
            "token": [token],
            "force_str": [force_str]
        });

        var reg = /\w{8}(-\w{4}){3}-\w{12}/;
		var key;


        if ((reg.test(uid) == false) && (reg.test(firmid) == false) || (reg.test(uid) == false) && (firmid == "") || (uid == "") && (reg.test(firmid) == false) || (uid == "") && (firmid == "")) {
            alert("Invalid Id!");
            return false;
        } else {
           // $("img").css("display", "block");
            $('from').submit();
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/tool",
                cache: false,
                data: JSON.stringify(jsonStr),
                contentType: "application/json",

                success: function (data) {
                 
	                 Cookies.set("logkey",data);
	                  $('.list-group').append('<li class="list-group-item active">'+ name + ':  ' + value + '</li>');
	                  timer = setInterval( getStr, 1000);
    
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                     alert(XMLHttpRequest.responseText);
                }

            });

        }
    });


   function getStr(){
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/log",
        cache: false,
        contentType: "application/json",
        success: function (data) {
          
        if(data.isDone == 0 && data.data != ""){
            for(var i = 0;i< data.data.length;i++){
                var arr = data.data.split(".");
                for(var j = 0;j<arr.length;j++){
                    $('.list-group').append('<li class="list-group-item">' + arr[j] + '</li>');
                }

            }
        
      
        //   $('.list-group').append('<li class="list-group-item">' + data.data + '</li>');
           
         }else if(data.isDone == 1){
            $('.list-group').append('<li class="list-group-item">' + data.data + '</li>');
            $('.list-group').append('<li class="list-group-item">' +'convertedlist' + ':' + data.complete.convertedlist + '</li>');
            $('.list-group').append('<li class="list-group-item"> convertedUsers: ' + data.complete.convertedUsers + '</li>');
            $('.list-group').append('<li class="list-group-item"> elapsedTime: ' + data.complete.elapsedTime + '</li>');

            clearInterval(timer);
        
         }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
             alert(XMLHttpRequest.responseText);
        }

    });
    

   }
})