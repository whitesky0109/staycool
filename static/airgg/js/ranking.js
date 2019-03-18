
var ranking = {};

ranking.init = function(){
	var objHome = $('#alrHome');
	var objMenu = $('#alrMenu');
	var objSeasonMonitor = $('#seasonMonitor');
	var getParams = common.getRequest();
	var season = common.season.getSeason(getParams.season);

	common.createHomeBanner(objHome);
	common.createMenubar(objMenu);
	common.createSeasonMonitor(objSeasonMonitor);

	ranking.setSeasonTitle(season);
	ranking.getSeasonData(season);

	common.season.setUpdateFunc(function(season){
		$("#seasonTitle").empty();
		$("#rankingFirst").empty();
		$("#rankingHighRankers").empty();
		$("#rankingList").empty();

		ranking.setSeasonTitle(season);
		ranking.getSeasonData(season);
	});
	common.version();
}

ranking.setSeasonTitle = function(season){
	var obj = $("#seasonTitle");

	obj.text("The Season: " + season);
}

ranking.getSeasonData = function(season){
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/season/users/?season=" + season,
		success: function(userSeasonData)
		{
			var summaryUsers = [];

			summaryUsers = common.season.summaryUsers(userSeasonData);

			var keys = Object.keys(summaryUsers);
			keys.sort(function (a,b) {
				if( summaryUsers[b].play < 10 )
					return -1;

				if ( summaryUsers[a].play < 10 )
					return 1;

				return summaryUsers[b].winRatio - summaryUsers[a].winRatio;
			});

			ranking.setFirstMember(keys[0],summaryUsers[keys[0]]);
			for ( var i = 1; i < 5; i++ )
			{
				ranking.setHighRanker(keys[i],summaryUsers[keys[i]]);
			}

			ranking.setRankingTable(keys, summaryUsers);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

ranking.setFirstMember = function(userName,userData) {
	var obj = $("#rankingFirst");

	var $div = $('<div>');
	var $tierImage = $('<img>',
				{'class':'ranking-highest-tier-img',
				 'src':common.tier.challenger});
	var $infoDiv = $('<div>');
	var $userIdLink = $('<a>',
			{'href':'/profile/?userName=' + userName,
			 'class':'ranking-highest_name'}).text(userName);
	var $userInfo = $('<p>').append("승률: "+ userData.winRatio +" %<br>게임 수: "+ userData.play);
	
	$div.append($tierImage);
	$infoDiv.append($userIdLink);
	$infoDiv.append($userInfo);
	$div.append($infoDiv);	

	obj.append($div);
}

ranking.setHighRanker = function(userName,userData) {
	var obj = $("#rankingHighRankers");

	var $div = $('<div class="col-sm-3">');
	var $tierImage = $('<img>',
				{'class':'ranking-highest-tier-img',
				 'src':common.tier.master});
	var $infoDiv = $('<div>');
	var $userIdLink = $('<a>',
			{'href':'/profile/?userName=' + userName,
			 'class':'ranking-highest_name'}).text(userName);
	var $userInfo = $('<p>').append("승률: "+ userData.winRatio +" %<br>게임 수: "+ userData.play);
	
	$div.append($tierImage);
	$infoDiv.append($userIdLink);
	$infoDiv.append($userInfo);
	$div.append($infoDiv);	

	obj.append($div);
}

ranking.setRankingTable = function(userKeys, userDatas) {
	var table = $("#rankingList");

	for(var i=5 ; i < userKeys.length; i++)
	{
		var $tableRowObj = $('<tr>',{'class':'ranking-list-table_row'});
		var $userIdObj = $('<td>');
		var $userIdLink = $('<a>',
			{'href':'/profile/?userName=' + userKeys[i],
			 'class':'ranking-highest_name'}).text(userKeys[i]);
		var $tierObj = $('<td>');
		var $tierImage = $('<img>',
					{'class':'ranking-tier-img'});
		var $playObj = $('<td>');
		var $winRatioObj = $('<td>');

		$playObj.text(userDatas[userKeys[i]].play);
		$winRatioObj.text(userDatas[userKeys[i]].winRatio + " %");

		if( userDatas[userKeys[i]].play < 4 )
		{
			$tableRowObj.addClass('table-danger');
		}

		if( userDatas[userKeys[i]].play < 10 )
		{
			$tierImage.attr('src',common.tier.unranked);
		}
		else if( Number(userDatas[userKeys[i]].winRatio) > 50)
		{
			$tierImage.attr('src',common.tier.diamond);
		}
		else if( Number(userDatas[userKeys[i]].winRatio) > 40)
		{
			$tierImage.attr('src',common.tier.platinum);
		}
		else
		{
			$tierImage.attr('src',common.tier.gold);
		}
		$tierObj.append($tierImage);

		$userIdObj.append($userIdLink);

		$tableRowObj.append($userIdObj);
		$tableRowObj.append($tierObj);
		$tableRowObj.append($playObj);
		$tableRowObj.append($winRatioObj);
		table.append($tableRowObj);
	}
}
