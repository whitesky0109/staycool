
var stats = {};

stats.home = {};
stats.home.gameWinChart = {};
stats.pickBan = {};
stats.title = {};
stats.title.comments = {
	'CARRY':'가장 높은 KDA 수치를 보유',
	'MURDER':'내전에서 가장 높은 킬 수치를 보유',
	'TERESA':'내전에서 가장 높은 어시스트 수치를 보유',
	'JOINER':'내전  참가를 가장 많이한 사람',
	'MOLA':'내전에서 가장 높은 데스 수치를 보유',
	'THE_JUNGLE':'협곡 그 자체...'
}

stats.position = {};
stats.position.lineComment = {
	'TOP':'The Top liner',
	'JUG':'The Jungle liner',
	'MID':'The Mid liner',
	'BOT':'The Bot liner',
	'SUP':'The Support Liner',
};

stats.init = function(){
	var getParams = common.getRequest();
	var season = 1;

	if ( getParams.type === "unique_title" )
	{
		stats.title.getSeasonUserData(season);
	}
	else if ( getParams.type === "pick_ban" )
	{
		stats.pickBan.initTable();
		stats.pickBan.getData(season);
	}
	else if ( getParams.type === "position_rank" )
	{
		stats.position.getUserData(season);
	}
	else if ( getParams.type === "for_manager" )
	{
		stats.test(getParams.type);
	}
	else
	{	
		stats.home.initContents();
		stats.home.getWinGameData(season);
		stats.home.getMostChampData(season);
	}
};

stats.test = function(text){
	var obj = $("#statsMainDiv");

	obj.append(text);
}

stats.home.getWinGameData = function(season){
	var season = 0;

	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/season/gamewin/?season" + season,
		success: function(gameWinData)
		{
			stats.home.setGameWinPie(gameWinData);
			stats.home.gameWinChart.update();
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

stats.home.getMostChampData = function(season){
	var season = 1;

	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/season/pickban/?season=" + season,
		success: function(championPickBan)
		{
			var keys = Object.keys(championPickBan)
			keys.sort(function (a,b) {
				var beta = (championPickBan[b].pick + championPickBan[b].ban) 
				var alpha = (championPickBan[a].pick + championPickBan[a].ban)

				return beta - alpha;
			})

			stats.home.setMostChamp(keys,championPickBan);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

stats.home.initContents = function(){
	var obj = $("#statsMainDiv");

	$divTop = $("<div id='topDiv' class='row stats-home-top'><div>");
	$divTop1 = $("<div class='col-sm'><div>");
	$divTop2 = $("<div class='col-sm'><div>");

	stats.home.initMostChamp($divTop1);
	stats.home.initGameWinPie($divTop2);

	$divTop.append($divTop1);
	$divTop.append($divTop2);

	obj.append($divTop);
}

stats.home.initGameWinPie = function(obj){
	$titleObj = $('<H2>Clan Team 승률</H2>');
	$canvasObj = $("<canvas id='gameWinPie' height='100px'></canvas>");
	obj.append($titleObj);
	obj.append($canvasObj);
}

stats.home.initMostChamp = function(obj){
	$mostChampObj = $("<div id='clanMostChamp'><H2>Clan Most Champ</H2></div>");
	obj.append($mostChampObj);
}

stats.home.setGameWinPie = function(gameWinData){
        var ctx = $('#gameWinPie');
	var total = gameWinData.win1 + gameWinData.win2;
	var win1 = (gameWinData.win1/total * 100).toFixed(2);
	var win2 = (gameWinData.win2/total * 100).toFixed(2);

        var gameWinArr = {
                datasets:[{
                        backgroundColor: ["#F7464A", "#46BFBD",],
                        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1"],
			data:[gameWinData.win1,gameWinData.win2]
                }],
		labels:['1 TEAM:'+win1+'%', '2 TEAM:'+win2+'%'],
        }

        stats.home.gameWinChart = new Chart(ctx,{
                type: 'pie',
                data: gameWinArr,
                options:{
                        title: {
				text: "Team 승률",
                                display: true,
                        },
                        animation: {
                                animateScale: true,
                        },
                }
        });
}

stats.home.setMostChamp = function(keys,championPickBan){
	var obj = $('#clanMostChamp');
	var imgOption = {'src':'full','version':'8.15.1','wrap':2,'skin':1,'gray':false,'size':'normal'};
	var $pickBanObj = $('<H6></H6>');
	var $winRatioObj = $('<H6></H6>');

	var winRatio = 0;
	if (championPickBan[keys[0]].pick != 0)
	{
		winRatio = (championPickBan[keys[0]].win/championPickBan[keys[0]].pick * 100).toFixed(2);
	}

	common.champion.getImg(obj,keys[0],imgOption);
	$pickBanObj.text("Pick: " + championPickBan[keys[0]].pick + " Ban: " + championPickBan[keys[0]].ban );
	$winRatioObj.text("승률: " + winRatio + "%");

	obj.append($pickBanObj);
	obj.append($winRatioObj);
}

stats.pickBan.getData = function(season){
	var season = 1;

	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/season/pickban/?season=" + season,
		success: function(championPickBan)
		{
			var keys = Object.keys(championPickBan)
			keys.sort(function (a,b) {
				var beta = (championPickBan[b].pick + championPickBan[b].ban) 
				var alpha = (championPickBan[a].pick + championPickBan[a].ban)

				return beta - alpha;
			})

			stats.pickBan.setTable(keys,championPickBan);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

stats.pickBan.initTable = function (){
	var obj = $("#statsMainDiv");

	var $tableContainer = $("<table class='table table-hover stats-table'> </table>");
	var $tableColgroup = $("<colgroup><col width='50'><col width='50'><col width='50'><col width='50'></colgroup>");
	var $tableThead = $("<thead class='thead'></thead>");
	var $tableTheadTr = $("<tr></tr>");
	var $tableTheadTitleChamp = $("<th class='stats-table_header'>챔피언</th>");
	var $tableTheadTitleWinRatio = $("<th class='stats-table_header'>승률</th>");
	var $tableTheadTitlePick = $("<th class='stats-table_header'>Pick</th>");
	var $tableTheadTitleBan = $("<th class='stats-table_header'>Ban</th>");
	var $tableBody = $("<tbody id='statsPickBanTableBody'></tbody>");

	$tableTheadTr.append($tableTheadTitleChamp);
	$tableTheadTr.append($tableTheadTitleWinRatio);
	$tableTheadTr.append($tableTheadTitlePick);
	$tableTheadTr.append($tableTheadTitleBan);
	$tableThead.append($tableTheadTr);

	$tableContainer.append($tableColgroup);
	$tableContainer.append($tableThead);
	$tableContainer.append($tableBody);

	obj.append($tableContainer);
}

stats.pickBan.setTable = function (keys, championPickBan){
	var obj = $('#statsPickBanTableBody');
	var imgOption = {'src':'sprite','version':'8.15.1','wrap':2,'skin':1,'gray':false,'size':'normal'};

        for(var i=0 ; i < keys.length; i++)
        {
                var $tableRowObj = $('<tr>',{'class':'pickban-list-table_row'});
                var $championObj = $('<td>');
                var $winRatioObj = $('<td>');
                var $pickObj = $('<td>').text(championPickBan[keys[i]].pick);
                var $banObj = $('<td>').text(championPickBan[keys[i]].ban);

		var winRatio = 0;
		if (championPickBan[keys[i]].pick != 0)
		{
			winRatio = (championPickBan[keys[i]].win/championPickBan[keys[i]].pick * 100).toFixed(2);
		}

		common.champion.getImg($championObj,keys[i],imgOption);
		$winRatioObj.text(winRatio + "%");

                $tableRowObj.append($championObj);
                $tableRowObj.append($winRatioObj);
                $tableRowObj.append($pickObj);
                $tableRowObj.append($banObj);
                obj.append($tableRowObj);
        }
}

stats.title.getSeasonUserData = function(season){
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/season/users/?season=" + season,
		success: function(userSeasonData)
		{
			var summaryUsers = [];

			summaryUsers = common.season.summaryUsers(userSeasonData);

			var carry = stats.title.findCarry(summaryUsers);
			var murder = stats.title.findMurder(summaryUsers);
			var teresa = stats.title.findTeresa(summaryUsers);
			var mola = stats.title.findMola(summaryUsers);
			var joiner = stats.title.findJoiner(summaryUsers);
			var theJungle = stats.title.findUser("AlR 쩨이",summaryUsers);

			stats.title.setTitle(carry,"케리",common.tier.challenger,stats.title.comments.CARRY);
			stats.title.setTitle(murder,"학살자",common.tier.challenger,stats.title.comments.MURDER);
			stats.title.setTitle(teresa,"테레사",common.tier.challenger,stats.title.comments.TERESA);
			stats.title.setTitle(mola,"개복치",common.tier.challenger,stats.title.comments.MOLA);
			stats.title.setTitle(joiner,"개근",common.tier.challenger,stats.title.comments.JOINER);
			stats.title.setTitle(theJungle,"더 정글",common.tier.challenger,stats.title.comments.THE_JUNGLE);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

stats.title.findCarry = function(summaryUsers){
	var user = {'userId':'','kill':'','death':'','asist':'','win':'','play':'','winRatio':''};
	var keys = Object.keys(summaryUsers);
	keys.sort(function (a,b) {
		if( summaryUsers[b].play < 10 )
			return -1;

		if ( summaryUsers[a].play < 10 )
			return 1;

		var kdab = (summaryUsers[b].kill + summaryUsers[b].asist)/summaryUsers[b].death;
		var kdaa = (summaryUsers[a].kill + summaryUsers[a].asist)/summaryUsers[b].death;

		return kdab - kdaa;
	});

	user.userId = keys[0];
	user.kill = summaryUsers[keys[0]].kill;
	user.death = summaryUsers[keys[0]].death;
	user.asist = summaryUsers[keys[0]].asist;
	user.win = summaryUsers[keys[0]].win;
	user.play = summaryUsers[keys[0]].play;
	user.winRatio = summaryUsers[keys[0]].winRatio;

	return user;
}

stats.title.findMurder = function(summaryUsers){
	var user = {'userId':'','kill':'','death':'','asist':'','win':'','play':'','winRatio':''};
	var keys = Object.keys(summaryUsers);
	keys.sort(function (a,b) {
		if( summaryUsers[b].play < 10 )
			return -1;

		if ( summaryUsers[a].play < 10 )
			return 1;

		var kb = summaryUsers[b].kill/summaryUsers[b].play;
		var ka = summaryUsers[a].kill/summaryUsers[a].play;

		return kb - ka;
	});

	user.userId = keys[0];
	user.kill = summaryUsers[keys[0]].kill;
	user.death = summaryUsers[keys[0]].death;
	user.asist = summaryUsers[keys[0]].asist;
	user.win = summaryUsers[keys[0]].win;
	user.play = summaryUsers[keys[0]].play;
	user.winRatio = summaryUsers[keys[0]].winRatio;

	return user;
}

stats.title.findTeresa = function(summaryUsers){
	var user = {'userId':'','kill':'','death':'','asist':'','win':'','play':'','winRatio':''};
	var keys = Object.keys(summaryUsers);
	keys.sort(function (a,b) {
		if( summaryUsers[b].play < 10 )
			return -1;

		if ( summaryUsers[a].play < 10 )
			return 1;

		var kb = summaryUsers[b].asist/summaryUsers[b].play;
		var ka = summaryUsers[a].asist/summaryUsers[a].play;

		return kb - ka;
	});

	user.userId = keys[0];
	user.kill = summaryUsers[keys[0]].kill;
	user.death = summaryUsers[keys[0]].death;
	user.asist = summaryUsers[keys[0]].asist;
	user.win = summaryUsers[keys[0]].win;
	user.play = summaryUsers[keys[0]].play;
	user.winRatio = summaryUsers[keys[0]].winRatio;

	return user;
}

// 개복치
stats.title.findMola = function(summaryUsers){
	var user = {'userId':'','kill':'','death':'','asist':'','win':'','play':'','winRatio':''};
	var keys = Object.keys(summaryUsers);
	keys.sort(function (a,b) {
		if( summaryUsers[b].play < 10 )
			return -1;

		if ( summaryUsers[a].play < 10 )
			return 1;

		var kb = summaryUsers[b].death/summaryUsers[b].play;
		var ka = summaryUsers[a].death/summaryUsers[a].play;

		return kb - ka;
	});

	user.userId = keys[0];
	user.kill = summaryUsers[keys[0]].kill;
	user.death = summaryUsers[keys[0]].death;
	user.asist = summaryUsers[keys[0]].asist;
	user.win = summaryUsers[keys[0]].win;
	user.play = summaryUsers[keys[0]].play;
	user.winRatio = summaryUsers[keys[0]].winRatio;

	return user;
}

stats.title.findJoiner = function(summaryUsers){
	var user = {'userId':'','kill':'','death':'','asist':'','win':'','play':'','winRatio':''};
	var keys = Object.keys(summaryUsers);

	keys.sort(function (a,b) {
		return summaryUsers[b].play - summaryUsers[a].play;
	});

	user.userId = keys[0];
	user.kill = summaryUsers[keys[0]].kill;
	user.death = summaryUsers[keys[0]].death;
	user.asist = summaryUsers[keys[0]].asist;
	user.win = summaryUsers[keys[0]].win;
	user.play = summaryUsers[keys[0]].play;
	user.winRatio = summaryUsers[keys[0]].winRatio;

	return user;
}

stats.title.findUser = function(userId,summaryUsers){
	var user = {'userId':'','kill':'','death':'','asist':'','win':'','play':'','winRatio':''};

	user.userId = userId;
	user.kill = summaryUsers[userId].kill;
	user.death = summaryUsers[userId].death;
	user.asist = summaryUsers[userId].asist;
	user.win = summaryUsers[userId].win;
	user.play = summaryUsers[userId].play;
	user.winRatio = summaryUsers[userId].winRatio;

	return user;
}

stats.title.setTitle = function(user,title,img,desc){
	var obj = $("#statsMainDiv");
	var $titleDiv = $('<div>', {'class': 'row stats-title-div border border-info'});
	var $titleImgDiv = $('<div>', {'class': 'col-sm'});
	var $titleInfoDiv = $('<div>', {'class': 'col-sm'});
	var $titleDocDiv = $('<div>', {'class': 'col-sm'});

	var $imgObj = $('<img>',{src:img});
	var $titleNameObj = $('<H4><span class="badge badge-primary">'+ title +'</H4>');
	var $infoIdObj = $('<p>');
	var $infoKdaObj = $('<p>');
	var $infoPlayObj = $('<p>');
	var $docObj = $('<p>');

	var k = (user.kill/user.play).toFixed(1);
	var d = (user.death/user.play).toFixed(1);
	var a = (user.asist/user.play).toFixed(1);

	$infoIdObj.text(user.userId);
	$infoKdaObj.text('KDA: ' + k + '/' + d + '/ '+ a);
	$infoPlayObj.text('Play: ' + user.play);
	$docObj.text(desc);

	$titleImgDiv.append($imgObj);
	$titleInfoDiv.append($titleNameObj);
	$titleInfoDiv.append($infoIdObj);
	$titleInfoDiv.append($infoKdaObj);
	$titleInfoDiv.append($infoPlayObj);
	$titleDocDiv.append($docObj);

	$titleDiv.append($titleImgDiv);
	$titleDiv.append($titleInfoDiv);
	$titleDiv.append($titleDocDiv);
	obj.append($titleDiv);
}

stats.position.getUserData = function(season){
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/season/users/?season=" + season,
		success: function(userSeasonData)
		{
			var summaryPUsers = [];

			summaryPUsers = common.season.summaryPositionUsers(userSeasonData);
			var mostTopUser = stats.position.findMostLiner(summaryPUsers['TOP']);
			var mostMidUser = stats.position.findMostLiner(summaryPUsers['MID']);
			var mostJugUser = stats.position.findMostLiner(summaryPUsers['JUG']);
			var mostBotUser = stats.position.findMostLiner(summaryPUsers['BOT']);
			var mostSupUser = stats.position.findMostLiner(summaryPUsers['SUP']);

			stats.position.setTitle (mostTopUser,'TOP',common.lineImg.TOP,stats.position.lineComment.TOP);
			stats.position.setTitle (mostJugUser,'JUG',common.lineImg.JUG,stats.position.lineComment.JUG);
			stats.position.setTitle (mostMidUser,'MID',common.lineImg.MID,stats.position.lineComment.MID);
			stats.position.setTitle (mostBotUser,'BOT',common.lineImg.BOT,stats.position.lineComment.BOT);
			stats.position.setTitle (mostSupUser,'SUP',common.lineImg.TOP,stats.position.lineComment.SUP);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

stats.position.findMostLiner = function(summaryUsers){
	var user = {'userId':'','kill':'','death':'','asist':'','win':'','play':'','winRatio':''};
	var keys = Object.keys(summaryUsers);

	keys.sort(function (a,b) {
		return summaryUsers[b].play - summaryUsers[a].play;
	});

	user.userId = keys[0];
	user.kill = summaryUsers[keys[0]].kill;
	user.death = summaryUsers[keys[0]].death;
	user.asist = summaryUsers[keys[0]].asist;
	user.win = summaryUsers[keys[0]].win;
	user.play = summaryUsers[keys[0]].play;
	user.winRatio = summaryUsers[keys[0]].winRatio;

	return user;
}

stats.position.setTitle = function(user,title,img,desc){
	var obj = $("#statsMainDiv");
	var $titleDiv = $('<div>', {'class': 'row stats-title-div border border-info'});
	var $titleImgDiv = $('<div>', {'class': 'col-sm'});
	var $titleInfoDiv = $('<div>', {'class': 'col-sm'});
	var $titleDocDiv = $('<div>', {'class': 'col-sm'});

	var $imgObj = $('<img>',{src:img});
	var $titleNameObj = $('<H4><span class="badge badge-primary">'+ title +'</H4>');
	var $infoIdObj = $('<p>');
	var $infoKdaObj = $('<p>');
	var $infoPlayObj = $('<p>');
	var $docObj = $('<p>');

	var k = (user.kill/user.play).toFixed(1);
	var d = (user.death/user.play).toFixed(1);
	var a = (user.asist/user.play).toFixed(1);

	$infoIdObj.text(user.userId);
	$infoKdaObj.text('KDA: ' + k + '/' + d + '/ '+ a);
	$infoPlayObj.text('Play: ' + user.play);
	$docObj.text(desc);

	$titleImgDiv.append($imgObj);
	$titleInfoDiv.append($titleNameObj);
	$titleInfoDiv.append($infoIdObj);
	$titleInfoDiv.append($infoKdaObj);
	$titleInfoDiv.append($infoPlayObj);
	$titleDocDiv.append($docObj);

	$titleDiv.append($titleImgDiv);
	$titleDiv.append($titleInfoDiv);
	$titleDiv.append($titleDocDiv);
	obj.append($titleDiv);
}
