
var profile = {};

profile.userName = "";

profile.init = function(){
	var getParams = common.getRequest();
	profile.userName = getParams['userName'];
	profile.setUserName(profile.userName);
	profile.getUserData(profile.userName);
};

profile.setUserName = function(name){
	var profileNameObj = $('#profileName');

	profileNameObj.append('<H3>' + name + '</H3>');
	profileNameObj.attr("href","/profile/?userName=" + name);	
};

profile.getUserData = function(name){
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/profile/?userName=" + name,
		success: function(userGameData)
		{
			var obj = $("#profileName");
			var mostData = common.user.summaryMostData(userGameData);
			var champData = common.user.summaryChampion(userGameData);
			var lineData = common.user.summaryLine(userGameData);

			common.champion.getImg(obj,mostData.champion,null);
			profile.setMainInfo(mostData.line,mostData.winRatio);
			profile.setLineInfo(lineData);
			profile.setChampTable(champData);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
};

profile.setMainInfo = function(line,winRatio)
{
	var obj = $("#profileMainInfo");

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

profile.setLineInfo = function(lineData)
{
	var topObj = $("#profileTopLineInfo");
	var jugObj = $("#profileJugLineInfo");
	var midObj = $("#profileMidLineInfo");
	var botObj = $("#profileBotLineInfo");
	var supObj = $("#profileSupLineInfo");

	var ratio = {'TOP':0,'JUG':0,'MID':0,'BOT':0,'SUP':0};

	for( data in lineData )
	{
		if( lineData[data].games != 0)
		{
			ratio[data] = (lineData[data].win/lineData[data].games * 100).toFixed(2);
		}
	}

	topObj.append("<br>승률: " + ratio['TOP'] + "%<br>게임 수:" + lineData['TOP'].games);
	jugObj.append("<br>승률: " + ratio['JUG'] + "%<br>게임 수:" + lineData['JUG'].games);
	midObj.append("<br>승률: " + ratio['MID'] + "%<br>게임 수:" + lineData['MID'].games);
	botObj.append("<br>승률: " + ratio['BOT'] + "%<br>게임 수:" + lineData['BOT'].games);
	supObj.append("<br>승률: " + ratio['SUP'] + "%<br>게임 수:" + lineData['SUP'].games);
}

profile.setChampTable = function(champData)
{
	var table_body = $("#profileChampTableBody");
	var imgOption = {'src':'sprite','version':'8.15.1','wrap':2,'skin':1,'gray':false,'size':'normal'};

	var keys = Object.keys(champData);

	keys.sort(function(a,b){
		return champData[b].play - champData[a].play;
	});

	for ( var index of keys )
	{
		var $tableRowObj = $('<tr>',{'class':'profile-champTable_row'});
		var $championObj = $('<td>');
		var $playObj = $('<td>');
		var $kdaObj = $('<td>');
		var $avrObj = $('<td>');
		var $winRatioObj = $('<td>');

		if ( champData[index].death == 0 )
		{
			champData[index].death = 1;
		}

		var kda = ((champData[index].kill + champData[index].asist)/champData[index].death).toFixed(2);
		var killAvr = (champData[index].kill/champData[index].play).toFixed(1);
		var deathAvr = (champData[index].death/champData[index].play).toFixed(1);
		var asistAvr = (champData[index].asist/champData[index].play).toFixed(1);
		var winRatio = (champData[index].win/champData[index].play*100).toFixed(2);

		$playObj.text(champData[index].play);
		$kdaObj.text(kda);
		$avrObj.text(killAvr + "/" + deathAvr + "/" + asistAvr);
		$winRatioObj.text(winRatio + "%");

		common.champion.getImg($championObj,index,imgOption);

		$tableRowObj.append($championObj);
		$tableRowObj.append($playObj);
		$tableRowObj.append($kdaObj);
		$tableRowObj.append($avrObj);
		$tableRowObj.append($winRatioObj);
		table_body.append($tableRowObj);
	}
}
