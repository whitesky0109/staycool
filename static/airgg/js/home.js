
var home = {};

home.init = function(){
	var getParams = common.getRequest();
	var season = common.season.getSeason(getParams.season);

	home.setSeasonTitle(season);
	home.getSeasonData(season);

	common.season.setUpdateFunc(function(season){
		home.clearPage();

		home.setSeasonTitle(season);
		home.getSeasonData(season);
	});

	common.version();
};

home.clearPage = function()
{
	$("#bestTitle").empty();
	$("#bestUserName").empty();
	$("#bestChampion").empty();
	$("#bestUserLine").empty();
	$("#bestUserKDA").empty();
}

home.setSeasonTitle = function(season)
{
	var objTitle = $("#bestTitle");

	objTitle.text(season + " 시즌 MVP");
}

home.getSeasonData = function(season){
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/season/users/?season=" + season,
		success: function(userMonthData)
		{
			var summaryUsers = [];

			summaryUsers = common.season.summaryUsers(userMonthData);
			var carry = stats.title.findCarry(summaryUsers);
			home.setBestPlayer(carry.userId);
			home.setUserKDA(carry);
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
			var objChamp = $("#bestChampion");
			var objUser = $("#bestUserName");
		        var $userIdLink = $('<a>',
                	        {'href':'/profile/?userName=' + userName,
                	         'class':'home-user-name'}).text(userName);
			var mostData = common.user.summaryMostData(userGameData);

			objUser.append($userIdLink);
			common.champion.getImg(objChamp,mostData.champion,null);
			home.setUserLine(mostData.line);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

home.setUserLine = function(line) {
	var obj = $("#bestUserLine");

	if( line === undefined )
	{
		line = "Unknown";
	}

	obj.append( "주 라인: "+ line);
}

home.setUserKDA = function(result) {
	var obj = $("#bestUserKDA");
	var kda = 0;

	if( result.death === 0 )
	{
		result.death = 1;
	}

	kda = ((result.kill + result.asist)/result.death).toFixed(2);

	obj.append("KDA: " + kda);
}

