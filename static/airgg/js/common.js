
var common = {};
common.champion = {};
common.user = {};
common.season = {};
common.tier = {
	'unranked':'/static/airgg/img/tier/provisional.png',
	'bronze':'/static/airgg/img/tier/bronze.png',
	'silver':'/static/airgg/img/tier/silver.png',
	'gold':'/static/airgg/img/tier/gold.png',
	'platinum':'/static/airgg/img/tier/platinum.png',
	'diamond':'/static/airgg/img/tier/diamond.png',
	'master':'/static/airgg/img/tier/master.png',
	'challenger':'/static/airgg/img/tier/challenger.png',
};

common.lineImg = {
	'TOP':'/static/airgg/img/Top_icon.png',
	'JUG':'/static/airgg/img/Jungle_icon.png',
	'MID':'/static/airgg/img/Mid_icon.png',
	'BOT':'/static/airgg/img/Bot_icon.png',
	'SUP':'/static/airgg/img/Support_icon.png',
}

common.onSearch = function() {
	var name = $('#airSearchInput').val();

	location.href = "/profile?userName=" + name;
}

common.getRequest = function() {
	if ( window.location.search.length > 1 ) {
		var get = new Object();
		var ret = location.search.substr(1).split('&');
		for(var i = 0; i < ret.length; i++){
			var r = ret[i].split('=');
			get[r[0]] = decodeURIComponent(r[1]);
		}
		return get;
	}
	else
	{
		return false;
	}
}

common.champion.getImg = function(obj, champion, option) {
	var imgOption = {};

	if ( (option === undefined) || (option == null) )
	{
		imgOption.src='full';
		imgOption.version='8.15.1';
		imgOption.wrap=2;
		imgOption.skin=1;
		imgOption.gray=false;
		imgOption.size='normal';
	}
	else
	{
		imgOption = option;
	}

	$.ajax({
		type: "GET",
		dataType: "json",
		url: "/static/airgg/riot_api/8.15.1/data/ko_KR/champion/" + champion + ".json" ,
		success: function(data)
		{
			var championInfo = data.data[champion];
			obj.append(Riot.DDragon.fn.getImg(championInfo,imgOption));
			
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

common.user.summaryMostData = function(userGameData) {
	var summaryMostData = {"champion":"", "line":"", "winRatio":""};

	var championList = {};
	var lineList = {};
	var winCnt = 0;

	var maxChamp = 0;
	var maxLine = 0;

	for ( var data in userGameData )
	{
		var champ = userGameData[data].fields.champion;
		var line = userGameData[data].fields.line;

		if ( championList[champ] === undefined )
		{
			championList[champ] = 1;
		}
		else
		{
			championList[champ]++;
		}

		if ( lineList[line] === undefined )
		{
			lineList[line] = 1;
		}
		else
		{
			lineList[line]++;
		}

		if ( userGameData[data].fields.win == 1 )
		{
			winCnt ++;
		}

		if ( maxChamp < championList[champ] )
		{
			summaryMostData.champion = champ;
			maxChamp = championList[champ];
		}

		if ( maxLine < lineList[line] )
		{
			summaryMostData.line = line;
			maxLine = lineList[line];
		}
	}	

	summaryMostData.winRatio = ((winCnt/userGameData.length) * 100).toFixed(2);

	return summaryMostData;
}

common.user.summaryChampion = function(userGameData) {
	var summaryChampion = {};

	for ( var data in userGameData )
	{
		var champ = userGameData[data].fields.champion;
		var kill = userGameData[data].fields.kill;
		var death = userGameData[data].fields.death;
		var asist = userGameData[data].fields.asist;
		var cs = userGameData[data].fields.cs;
		var win = userGameData[data].fields.win;

		if( summaryChampion[champ] === undefined )
		{
			var obj = {'kill':'','death':'','asist':'','cs':'','win':'','play':''};

			obj.kill = kill;
			obj.death = death;
			obj.asist = asist;
			obj.cs = cs;
			if( win == 1 )
			{
				obj.win = 1;
			}
			else
			{
				obj.win = 0;
			}
			obj.play = 1;
			summaryChampion[champ] = obj;
		}
		else
		{
			summaryChampion[champ].kill = summaryChampion[champ].kill + kill;
			summaryChampion[champ].death = summaryChampion[champ].death + death;
			summaryChampion[champ].asist = summaryChampion[champ].asist + asist;
			summaryChampion[champ].cs = summaryChampion[champ].cs + cs;
			if( win == 1 )
			{
				summaryChampion[champ].win++;
			}
			summaryChampion[champ].play++;
		}
	}

	return summaryChampion;
}

common.user.summaryLine = function(userGameData) {
	var summaryLine = {'TOP':{'win':0,'games':0},
				'JUG':{'win':0,'games':0},
				'MID':{'win':0,'games':0},
				'BOT':{'win':0,'games':0},
				'SUP':{'win':0,'games':0}};

	for ( var data in userGameData )
	{
		var line = userGameData[data].fields.line;
		var win = userGameData[data].fields.win;

		if( summaryLine[line] === undefined )
		{
			continue;
		}
		else
		{
			if ( win == 1 )
			{
				summaryLine[line].win++;
			}
			summaryLine[line].games++;
		}
	}

	return summaryLine;
}

common.season.summaryUsers = function(userSeasonData)
{
	var summaryUsers = {};

	for( var data in userSeasonData )
	{
		var userId = userSeasonData[data].fields.user_id;
		if ( summaryUsers[userId] === undefined )
		{
			summaryUsers[userId] = {};
			summaryUsers[userId].kill = userSeasonData[data].fields.kill;
			summaryUsers[userId].death = userSeasonData[data].fields.death;
			summaryUsers[userId].asist = userSeasonData[data].fields.asist;
			summaryUsers[userId].win = userSeasonData[data].fields.win;
			summaryUsers[userId].play = 1;
		}
		else
		{
			summaryUsers[userId].kill += userSeasonData[data].fields.kill;
			summaryUsers[userId].death += userSeasonData[data].fields.death;
			summaryUsers[userId].asist += userSeasonData[data].fields.asist;
			if ( userSeasonData[data].fields.win == 1 )
			{
				summaryUsers[userId].win++;
			}
			summaryUsers[userId].play++;
		}
	}

	for( var data in summaryUsers )
	{
		summaryUsers[data].winRatio = ((summaryUsers[data].win/summaryUsers[data].play) * 100).toFixed(2);
	}

	return summaryUsers;
}

common.season.summaryPositionUsers = function(userSeasonData)
{
	var summaryUsers = {};

	for( var data in userSeasonData )
	{
		var position = userSeasonData[data].fields.line;
		var userId = userSeasonData[data].fields.user_id;
		if ( summaryUsers[position] === undefined )
		{
			summaryUsers[position] = {};
		}

		if ( summaryUsers[position][userId] === undefined )
		{
			summaryUsers[position][userId] = {};
			summaryUsers[position][userId].kill = userSeasonData[data].fields.kill;
			summaryUsers[position][userId].death = userSeasonData[data].fields.death;
			summaryUsers[position][userId].asist = userSeasonData[data].fields.asist;
			summaryUsers[position][userId].win = userSeasonData[data].fields.win;
			summaryUsers[position][userId].play = 1;
		}
		else
		{
			summaryUsers[position][userId].kill += userSeasonData[data].fields.kill;
			summaryUsers[position][userId].death += userSeasonData[data].fields.death;
			summaryUsers[position][userId].asist += userSeasonData[data].fields.asist;
			if ( userSeasonData[data].fields.win == 1 )
			{
				summaryUsers[position][userId].win++;
			}
			summaryUsers[position][userId].play++;
		}
	}

	return summaryUsers;
}

