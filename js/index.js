$(document).ready(function () {

	function adjustHeight() {
		$('#lapListCont').height(($(window).height() - $('#stopWatch').height() - $('#heightlap').height() - 110) + "px");
	}
	adjustHeight();
	$(window).on('resize', function () {
		adjustHeight();
	});

	var startTime;
	var timeout;
	var bol;
	var pauseTime = 0;
	var mils;
	//var paused = false;
	var count = 0;
	var split = 0;
	$('#btnSplit').on('click', function () {
		$.confirm({
			theme: 'supervan',
			title: 'Confirm!',
			content: 'Confirm if it is a valid grade!',
			buttons: {
				confirm: {
					text: 'Valid',
					btnClass: 'btn-blue',
					keys: ['enter', 'shift'],

					action: function () {
						bol = true;
						splitFunc(mils);
					}

				},
				cancel: function () {
					bol = false;
					splitFunc(mils);
				}
			}
		});


		// var jsonStr = {
		// 	"TeamName": [teamName],
		// 	"Rotation":[count],
		// 	"Score":[score],
		// 	"Status":[bol],
		// 	"CreateOn":[curTime]
		// }

		// $.ajax({
		// 	type: "POST",
		// 	url: "http://localhost:8080/aaa",
		// 	cache:false,
		// 	data:JSON.stringify(jsonStr),
		// 	contentType:"application/json",

		// 	success: function (data,textStatus, request) {
		// 	     alert('succeed')

		// 	},
		// 	error:function(XMLHttpRequest, textStatus, errorThrown){
		// 		alert("请求对象XMLHttpRequest: "+XMLHttpRequest);
		// 		alert("错误类型textStatus: "+textStatus);
		// 		alert("异常对象errorThrown: "+errorThrown);
		// 	   }

		// });





	});

	// $('#btnPause').on('click', function () {
	// 	if (paused == false) {
	// 		paused = true;
	// 		clearTimeout(timeout);
	// 		pauseTime = mils;
	// 		$(this).html('<i class="icon-play-circle"></i>Resume');
	// 		$('#time').addClass('paused');
	// 	} else {
	// 		paused = false;
	// 		$(this).html('<i class="icon-pause"></i>Pause');
	// 		startTime = new Date();
	// 		clock();
	// 	}
	// });

	$('#btnStop').on('click', function () {
		//	$('#title').slideDown();

		$('#time').removeClass('paused');
		paused = false;
		clearTimeout(timeout);
		pauseTime = 0;
		mils = 0;
		$('#time').html('00:00');
		$('#btnClear').click();
		$('#divControls').fadeOut(function () {
			$('#divStart').fadeIn()

		});
	});
	$('#btnStart').on('click', function () {
		// $('#title').slideUp(function () {
		// 	adjustHeight();
		// });
		startTime = new Date();
		clock();
		$('#divStart').fadeOut(function () {
			$('#divControls').fadeIn();
			$('#lapTimes').fadeIn();
		});
	});

	function clock() {
		$('#time').removeClass('paused');
		var curTime = new Date();
		mils = (curTime - startTime) + pauseTime;
		var time = milToTime(mils);
		formatTime(time);
		var outStr = time.m + ':' + time.s;
		document.getElementById('time').innerHTML = outStr;
		timeout = setTimeout(clock, 0);
		if (mils > 4 * 60000) {
			clearTimeout(timeout);
		}
	}

	function formatTime(time) {
		for (var i in time) {
			if (i == "mils") {
				if (time[i] < 1) {
					time[i] = "000";
				} else
				if (time[i] < 10) {
					time[i] = "00" + time[i];
				} else
				if (time[i] < 100) {
					time[i] = "0" + time[i];
				}
			} else if (time[i] < 10) {
				time[i] = "0" + time[i];
			}
		}
		return time;
	}

	function milToTime(mil) {
		mi = mil % 1000;
		seconds = parseInt(mil / 1000) % 60;
		minutes = parseInt(mil / 1000 / 60) % 60;
		hours = parseInt(mil / 1000 / 3600);
		return {
			s: seconds,
			m: minutes,
			h: hours,
			mils: mi
		};
	}

	$('#btnClear').on('click', function () {
		$('#lapList, #btnClear').fadeOut(function () {
			$('#lapList').html('').fadeIn();
			$('#timeTable thead').hide();

			count = 0;
		});
	});

	function getNowFormatDate() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
			" " + date.getHours() + seperator2 + date.getMinutes() +
			seperator2 + date.getSeconds();
		return currentdate;
	}

	function splitFunc(mils) {
		if (mils != undefined) {
			if (mils > 0) {
				var time = milToTime(mils - split);
				split = mils;
				time = formatTime(time);

				count += 1;
				var curTime = getNowFormatDate();
				var teamName = "Alita";
				var score = time.m + ':' + time.s + '.' + time.mils;

				$('#timeTable thead').show();
				$('#lapList').prepend('<tr class="timeRow"><td>' + teamName + '</td><td class="lapCount muted">' + count + "</td><td>" + score + '</td><td>' + bol + '</td><td>' + curTime + '</td></tr>');
				$('#lapListCont').animate({
					scrollTop: 0
				}, "fast");
			}
		}
	}
});