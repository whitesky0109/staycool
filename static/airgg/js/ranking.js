
var ranking = {};

ranking.init = function(){
	ranking.setSeasonTitle(1);
	ranking.getSeasonData(1);
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
			ranking.setSecondMember(keys[1],summaryUsers[keys[1]]);
			ranking.setThirdMember(keys[2],summaryUsers[keys[2]]);
			ranking.setRankingTable(keys, summaryUsers);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

ranking.setFirstMember = function(userName,userData) {
	var obj = $("#firstClass");

	var $tierImage = $('<img>',
				{'class':'ranking-highest-tier-img',
				 'src':common.tier.challenger});
	var $div = $('<div>');
	var $userIdLink = $('<a>',
			{'href':'/airgg/profile/?userName=' + userName,
			 'class':'ranking-highest_name'}).text(userName);
	var $userInfo = $('<p>').append("승률: "+ userData.winRatio +"%<br>게임 수: "+ userData.play);

	obj.append($tierImage);
	$div.append($userIdLink);
	$div.append($userInfo);
	obj.append($div);
}

ranking.setSecondMember = function(userName,userData) {
	var obj = $("#secondClass");

	var $tierImage = $('<img>',
				{'class':'ranking-highest-tier-img',
				 'src':common.tier.master});

	var $div = $('<div>');
	var $userIdLink = $('<a>',
			{'href':'/airgg/profile/?userName=' + userName,
			 'class':'ranking-highest_name'}).text(userName);
	var $userInfo = $('<p>').append("승률: "+ userData.winRatio +"%<br>게임 수: "+ userData.play);

	obj.append($tierImage);
	$div.append($userIdLink);
	$div.append($userInfo);
	obj.append($div);
}

ranking.setThirdMember = function(userName,userData) {
	var obj = $("#thirdClass");

	var $tierImage = $('<img>',
				{'class':'ranking-highest-tier-img',
				 'src':common.tier.diamond});
	var $div = $('<div>');
	var $userIdLink = $('<a>',
			{'href':'/airgg/profile/?userName=' + userName,
			 'class':'ranking-highest_name'}).text(userName);
	var $userInfo = $('<p>').append("승률: "+ userData.winRatio +" %<br>게임 수: "+ userData.play);

	obj.append($tierImage);
	$div.append($userIdLink);
	$div.append($userInfo);
	obj.append($div);
}

ranking.setRankingTable = function(userKeys, userDatas) {
	var table = $("#rankingList");

	for(var i=3 ; i < userKeys.length; i++)
	{
		var $tableRowObj = $('<tr>',{'class':'ranking-list-table_row'});
		var $userIdObj = $('<td>');
		var $userIdLink = $('<a>',
			{'href':'/airgg/profile/?userName=' + userKeys[i],
			 'class':'ranking-highest_name'}).text(userKeys[i]);
		var $tierObj = $('<td>');
		var $tierImage = $('<img>',
					{'class':'ranking-tier-img'});
		var $playObj = $('<td>');
		var $winRatioObj = $('<td>');

		$playObj.text(userDatas[userKeys[i]].play);
		$winRatioObj.text(userDatas[userKeys[i]].winRatio + " %");

		if( userDatas[userKeys[i]].play < 10 )
		{
			$tierImage.attr('src',common.tier.unranked);
		}
		else if( Number(userDatas[userKeys[i]].winRatio) > 50)
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
