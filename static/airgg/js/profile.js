
var profile = {};

profile.userName = "";
profile.radarChart = {};

profile.init = function(){
	var getParams = common.getRequest();
	var season = 'ALL';

	profile.initRadarChart();

	profile.userName = getParams['userName'];
	profile.setUserName(profile.userName);
	profile.getUserData(profile.userName, season);

	common.season.setUpdateFunc(function(season){
		$("#profileName").empty();
		$("#profileMainInfo").empty();
		$("#profileChampTableBody").empty();

		profile.setUserName(profile.userName);
		profile.getUserData(profile.userName, season);
	});


	common.version();
};


profile.setUserName = function(name){
	var profileNameObj = $('#profileName');

	profileNameObj.append('<H3>' + name + '</H3>');
	profileNameObj.attr("href","/profile/?userName=" + name);	
};

profile.getUserData = function(name, season){
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/profile/?userName=" + name + '&season=' + season,
		success: function(userGameData)
		{
			var mostData = common.user.summaryMostData(userGameData);
			var champData = common.user.summaryChampion(userGameData);
			var lineData = common.user.summaryLine(userGameData);

			profile.setMainInfo(mostData.line,mostData.winRatio);
			profile.setLineInfo(lineData);
			profile.setChampTable(champData);
			profile.setRadarChartBackgroundImg(mostData.champion);
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
	else
	{
		var imgObj = $('<img>',{src:common.lineImg[line]});
		obj.append(imgObj);
	}

	if ( winRatio === undefined )
	{
		winRatio = 0;
	}

	obj.append( "<br>주 라인: "+ line + "<br>" + "승률: " + winRatio + "%");
}

profile.setLineInfo = function(lineData)
{
/* old code
	var topObj = $("#profileTopLineInfo");
	var jugObj = $("#profileJugLineInfo");
	var midObj = $("#profileMidLineInfo");
	var botObj = $("#profileBotLineInfo");
	var supObj = $("#profileSupLineInfo");
*/
	var playTotal = 0; 
	var ratio = {'TOP':0,'JUG':0,'MID':0,'BOT':0,'SUP':0};

	for( data in lineData )
	{
		if( lineData[data].games != 0)
		{
			ratio[data] = (lineData[data].win/lineData[data].games * 100).toFixed(2);
		}
		playTotal = playTotal + lineData[data].games;
	}
/* old code
	topObj.append("<br>승률: " + ratio['TOP'] + "%<br>게임 수:" + lineData['TOP'].games);
	jugObj.append("<br>승률: " + ratio['JUG'] + "%<br>게임 수:" + lineData['JUG'].games);
	midObj.append("<br>승률: " + ratio['MID'] + "%<br>게임 수:" + lineData['MID'].games);
	botObj.append("<br>승률: " + ratio['BOT'] + "%<br>게임 수:" + lineData['BOT'].games);
	supObj.append("<br>승률: " + ratio['SUP'] + "%<br>게임 수:" + lineData['SUP'].games);
*/
	var winratioArr = [ratio['TOP'],ratio['MID'],ratio['JUG'],ratio['BOT'],ratio['SUP']];
	var playrateArr = [
		lineData['TOP'].games/playTotal*100,
		lineData['MID'].games/playTotal*100,
		lineData['JUG'].games/playTotal*100,
		lineData['BOT'].games/playTotal*100,
		lineData['SUP'].games/playTotal*100];
	

	profile.addWinrateRadarChart(profile.radarChart, winratioArr);
	profile.addPlayrateRadarChart(profile.radarChart, playrateArr);
	profile.radarChart.update();
}

profile.setChampTable = function(champData)
{
	var table_body = $("#profileChampTableBody");
	var imgOption = {'src':'sprite','version':'9.2.1','wrap':2,'skin':1,'gray':false,'size':'normal','classes':'profile-champTable_img'};

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


profile.initRadarChart = function() {
	var ctx = $('#profileRadar');
	var profileRadarArr = {
		labels: ['TOP', 'MID', 'JUG', 'BOT', 'SUP'],
		datasets:[
			{
				label: "winrate",
				backgroundColor: "rgba(255,0,0,0.2)",
				hoverBackgroundColor: "rgb(255,0,0)",
				borderColor: "rgba(255,0,0,1.0)"
			},
			{
				label: "playrate",
				backgroundColor: "rgba(0,255,0,0.2)",
				hoverBackgroundColor: "rgb(0,255,0)",
				borderColor: "rgba(0,255,0,1.0)"
			}
		],	
	}


	profile.radarChart = new Chart(ctx,{
		type: 'radar',
		data: profileRadarArr,
		options:{
			title: {
				display: false,
			},
			animation: {
				animateScale: true,
			},
			scale: {
				pointLabels:{
					fontColor: 'white',
				},
				ticks: {
					max: 100,
					min: 0,
					display: false,
				},
				angleLines: {
					color: 'white'
				}
			},
			legend: {
				labels: {
					fontColor: 'white'
				}
			}
		},
	});

}

profile.setRadarChartBackgroundImg = function(champName)
{
	var obj = $("#profileStatus");
	obj.css('background-image','url(/static/airgg/riot_api/img/champion/splash/'+champName+'_0.jpg)');
	obj.css('background-size','100%');
}

profile.addWinrateRadarChart = function (chart, data) {
	chart.data.datasets[0].data = data;
}

profile.addPlayrateRadarChart = function (chart, data){
	chart.data.datasets[1].data = data;
}

