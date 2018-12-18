
var home = {};

home.init = function(){
	var year = 2018;
	var month = 12;

	home.setMonthTitle(year,month);
	home.getMonthData(year,month);

	common.version();
};

home.setMonthTitle = function(year, month)
{
	var obj = $("#bestMonthTitle");

	obj.text(month + "월의 용사");
}

home.getMonthData = function(year,month){
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/month/users/?year="+year+"&month="+month,
		success: function(userMonthData)
		{
			var summaryUsers = [];

			summaryUsers = common.season.summaryUsers(userMonthData);

			var keys = Object.keys(summaryUsers);
			keys.sort(function (a,b) {
				if ( summaryUsers[b].play == summaryUsers[a].play )
				{
					return  summaryUsers[b].winRatio - summaryUsers[a].winRatio;
				}
				return summaryUsers[b].play - summaryUsers[a].play;
			});

			home.setBestPlayer(keys[0],summaryUsers[keys[0]]);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

home.setBestPlayer = function(userName, userData){
	home.loadUserData(userName);
}

home.loadUserData = function(userName)
{
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/profile/?userName=" + userName,
		success: function(userGameData)
		{
			var obj = $("#bestChampion");
			$("#bestUserName").text(userName);
			var mostData = common.user.summaryMostData(userGameData);

			common.champion.getImg(obj,mostData.champion,null);
			home.setMainInfo(mostData.line,mostData.winRatio);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

home.setMainInfo = function(line,winRatio) {
	var obj = $("#bestUserInfo");

	if( line === undefined )
	{
		line = "Unknown";
	}

	if ( winRatio === undefined )
	{
		winRatio = 0;
	}

	obj.append( "주 라인: "+ line + "<br>" + "승률: " + winRatio + "%");
}

