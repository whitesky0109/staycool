
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

stats.relative = {};
stats.member = {};
stats.season = {};

stats.init = function(){
	var getParams = common.getRequest();
	var season = common.season.getSeason(getParams.season);
	
	if ( getParams.type === "unique_title" )
	{
		stats.title.getSeasonUserData(season);
		common.season.setUpdateFunc(function(season){
			$("#statsMainDiv").empty();
			stats.title.getSeasonUserData(season);
		});
	}
	else if ( getParams.type === "pick_ban" )
	{
		stats.pickBan.initTable();
		stats.pickBan.getData(season);
		common.season.setUpdateFunc(function(season){
			$("#statsMainDiv").empty();
			stats.pickBan.initTable();
			stats.pickBan.getData(season);
		});
	}
	else if ( getParams.type === "position_rank" )
	{
		stats.position.getUserData(season);
		common.season.setUpdateFunc(function(season){
			$("#statsMainDiv").empty();
			stats.position.getUserData(season);
		});
	}
	else if ( getParams.type === "relative_total" )
	{
		stats.relative.initSearchButton(season);
		common.season.setUpdateFunc(function(season){
			stats.relative.onSearch(season);
		});
	}
	else if ( getParams.type === "for_manager" )
	{
		stats.member.initTable();
		stats.member.setMemberNames();
		stats.member.getData(season);
		common.season.setUpdateFunc(function(season){
			$("#statsMainDiv").empty();
			stats.member.initTable();
			stats.member.setMemberNames();
			stats.member.getData(season);
		});
	}
	else
	{	
		stats.home.initContents();
		stats.home.getMostChampData(season);
		stats.home.getMostDuoData(season);
		common.season.setUpdateFunc(function(season){
			$("#statsMainDiv").empty();
			stats.home.initContents();
			stats.home.getMostChampData(season);
			stats.home.getMostDuoData(season);
		});
	}

	common.version();
};


stats.home.getWinGameData = function(season){

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

stats.home.getMostDuoData = function(season){

	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/season/duo/?season=0",
		success: function(duoDatas)
		{
			var obj = $("#statsMainDiv");
			var keys = Object.keys(duoDatas)
			keys.sort(function (a,b) {
				if( duoDatas[b].play < 5 )
					return -1;

				if ( duoDatas[a].play < 5 )
					return 1;

				var beta = duoDatas[b].win/duoDatas[b].play;
				var alpha = duoDatas[a].win/duoDatas[a].play;

				return beta - alpha;
			})

			stats.home.setMostDuo(obj,duoDatas[keys[0]]);
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

stats.home.initContents = function(){
	var obj = $("#statsMainDiv");

	$divTop = $("<div id='topDiv' class='row stats-home'><div>");
	$divTop1 = $("<div class='col-sm-6'><div>");
	$divTop2 = $("<div class='col-sm-6'><div>");

	stats.home.initMostChamp($divTop1);
	stats.home.initGameWinPie($divTop2);

	$divTop.append($divTop1);
	$divTop.append($divTop2);

	obj.append($divTop);
}

stats.home.initGameWinPie = function(obj){
	$titleObj = $('<H2>공사중.</H2>');
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
	var imgOption = {'src':'full','version':'8.24.1','wrap':2,'skin':1,'gray':false,'size':'normal'};
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

stats.home.setMostDuo = function(obj,duo){
	var $div = $('<div class="best-duo">');
	var $bestDuoTitle = $('<h2>Clan BEST DUO</h2>');
	var $duoNameInfo = $('<h6 style="padding-top:130px"> BOT: ' + duo.BOT + '/ SUP: ' + duo.SUP + '</h6>');
	var $duoGameInfo = $('<h6> PLAY: ' + duo.play + '/ WIN: ' + duo.win + '</h6>');

	$div.append($duoNameInfo);
	$div.append($duoGameInfo);

	obj.append($bestDuoTitle);
	obj.append($div);
}

stats.pickBan.getData = function(season){

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

stats.pickBan.initTable = function (season){
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
	var imgOption = {'src':'sprite','version':'8.24.1','wrap':2,'skin':1,'gray':false,'size':'normal'};

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
			var summaryUsers = {};

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
		var kdaa = (summaryUsers[a].kill + summaryUsers[a].asist)/summaryUsers[a].death;

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
	var $titleImgDiv = $('<div>', {'class': 'col-sm-4'});
	var $titleInfoDiv = $('<div>', {'class': 'col-sm-4'});
	var $titleDocDiv = $('<div>', {'class': 'col-sm-4'});

	var $imgObj = $('<img>',{'src':img,'class':'stats-title-img'});
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
	var $titleImgDiv = $('<div>', {'class': 'col-sm-4'});
	var $titleInfoDiv = $('<div>', {'class': 'col-sm-4'});
	var $titleDocDiv = $('<div>', {'class': 'col-sm-4'});

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

stats.relative.initSearchButton = function(season){
	var obj = $("#statsMainDiv");

	var $div = $('<div>',{class: 'input-group mb-3 input-group-lg col-lg-6 col-sm-7'});
	var $divAppendObj = $('<div>',{class: 'input-group-append'});
	var $divPrependObj = $('<div>',{class: 'input-group-prepend'});
	var $divPrependValObj = $('<span>',{class: 'input-group-text'}).text('USER_ID');
	var $searchInputObj = $("<input id='relativeSearchInput' class='form-control' type='text' placeholder='Search..'>'");
	var $searchButtonObj = $("<button>",{
				id: 'relativeSearchBtn',
				onclick: 'stats.relative.onSearch('+ season +')',
				class: 'stats-relative-searchBtn'
				});

	var $searchButtonImg = $("<img>",{
				id: 'relativeSearchBtnImg',
				src: '/static/airgg/img/search.png',
				});

	$div.append($divPrependObj);

	$searchButtonObj.append($searchButtonImg);
	$divPrependObj.append($divPrependValObj);
	$div.append($searchInputObj);
	$divAppendObj.append($searchButtonObj);

	$div.append($divAppendObj);
	obj.append($div);	
}

stats.relative.onSearch = function(season) {
	var name = $('#relativeSearchInput').val();

	$('#statsRelativeTable').remove();

	stats.relative.getData(season,name);
}

stats.relative.getData = function(season ,userId){
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/season/users/?season=" + season,
		success: function(userSeasonData)
		{
			var summaryRelative = {};
			summaryRelative = common.season.summaryRelative(userSeasonData, userId);

			var keys = Object.keys(summaryRelative);
			keys.sort(function (a,b) {
				return summaryRelative[b].play - summaryRelative[a].play;
			});

			stats.relative.initTable();
			stats.relative.setTable(keys, summaryRelative);

		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

stats.relative.initTable = function (){
	var obj = $("#statsMainDiv");

	var $tableContainer = $("<table id='statsRelativeTable' class='table table-hover stats-table'> </table>");
	var $tableColgroup = $("<colgroup><col width='100'><col width='40'><col width='40'><col width='50'><col width='30'><col width='30'><col width='30'><col width='30'><col width='30'></colgroup>");
	var $tableThead = $("<thead class='thead'></thead>");
	var $tableTheadTr = $("<tr></tr>");
	var $tableTheadTitleUser = $("<th class='stats-table_header'>USER</th>");
	var $tableTheadTitleWinratio = $("<th class='stats-table_header'>WINRATIO</th>");
	var $tableTheadTitleWin = $("<th class='stats-table_header'>WIN</th>");
	var $tableTheadTitlePlay = $("<th class='stats-table_header'>PLAY</th>");
	var $tableTheadTitleTop = $("<th class='stats-table_header'>TOP</th>");
	var $tableTheadTitleJug = $("<th class='stats-table_header'>JUG</th>");
	var $tableTheadTitleMid = $("<th class='stats-table_header'>MID</th>");
	var $tableTheadTitleBot = $("<th class='stats-table_header'>BOT</th>");
	var $tableTheadTitleSup = $("<th class='stats-table_header'>SUP</th>");
	var $tableBody = $("<tbody id='statsRelativeTableBody'></tbody>");

	$tableTheadTr.append($tableTheadTitleUser);
	$tableTheadTr.append($tableTheadTitleWinratio);
	$tableTheadTr.append($tableTheadTitleWin);
	$tableTheadTr.append($tableTheadTitlePlay);
	$tableTheadTr.append($tableTheadTitleTop);
	$tableTheadTr.append($tableTheadTitleJug);
	$tableTheadTr.append($tableTheadTitleMid);
	$tableTheadTr.append($tableTheadTitleBot);
	$tableTheadTr.append($tableTheadTitleSup);
	$tableThead.append($tableTheadTr);

	$tableContainer.append($tableColgroup);
	$tableContainer.append($tableThead);
	$tableContainer.append($tableBody);

	obj.append($tableContainer);
}

stats.relative.setTable = function (keys, relativeObj){
	var obj = $('#statsRelativeTableBody');

        for(var id of keys )
        {
                var $tableRowObj = $('<tr>');
                var $userObj = $('<td>');
		var $userLink = $('<a>',
			{'href':'/profile/?userName=' + id}).text(id);
                var $winObj = $('<td>').text(relativeObj[id].win);
                var $playObj = $('<td>').text(relativeObj[id].play);
                var $winRatioObj = $('<td>');
                var $topObj = $('<td>').text(relativeObj[id].TOP);
                var $jugObj = $('<td>').text(relativeObj[id].JUG);
                var $midObj = $('<td>').text(relativeObj[id].MID);
                var $botObj = $('<td>').text(relativeObj[id].BOT);
                var $supObj = $('<td>').text(relativeObj[id].SUP);

		var winRatio = (relativeObj[id].win/relativeObj[id].play * 100).toFixed(2);

		$winRatioObj.text(winRatio + "%");

                $userObj.append($userLink);

                $tableRowObj.append($userObj);
                $tableRowObj.append($winRatioObj);
                $tableRowObj.append($winObj);
                $tableRowObj.append($playObj);
                $tableRowObj.append($topObj);
                $tableRowObj.append($jugObj);
                $tableRowObj.append($midObj);
                $tableRowObj.append($botObj);
                $tableRowObj.append($supObj);
                obj.append($tableRowObj);
        }
}

stats.member.initTable = function (){
	var obj = $("#statsMainDiv");

	var $tableContainer = $("<table class='table table-hover stats-table'> </table>");
	var $tableColgroup = $("<colgroup><col width='50'><col width='50'></colgroup>");
	var $tableThead = $("<thead class='thead'></thead>");
	var $tableTheadTr = $("<tr></tr>");
	var $tableTheadTitleUserId = $("<th class='stats-table_header'>USER_ID</th>");
	var $tableTheadTitlePlays = $("<th class='stats-table_header'>PLAYS</th>");
	var $tableBody = $("<tbody id='statsMemberTableBody'></tbody>");

	$tableTheadTr.append($tableTheadTitleUserId);
	$tableTheadTr.append($tableTheadTitlePlays);
	$tableThead.append($tableTheadTr);

	$tableContainer.append($tableColgroup);
	$tableContainer.append($tableThead);
	$tableContainer.append($tableBody);

	obj.append($tableContainer);

}

stats.member.memberHashKeys = [];

stats.member.setMemberNames = function()
{
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "/f/members/",
		success: function(members)
		{
			var obj = $("#statsMemberTableBody");
			var i = 0;

			for( var index in members) {
				var userId = members[index].pk;
                		var $tableRowObj = $('<tr>',{'class':'member-list-table_row'});
                		var $userIdObj = $('<td>').text(userId);
                		var $playsObj = $('<td>',{'id':'userId'+i}).text('0');

				stats.member.memberHashKeys[userId] = i;
				i++;

				$tableRowObj.append($userIdObj);
				$tableRowObj.append($playsObj);
				obj.append($tableRowObj);
			}
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

stats.member.getData = function(season){
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/season/users/?season=" + season,
		success: function(userSeasonData)
		{
			var playObj = {};

			for( var index in userSeasonData)
			{
				var tempObj = userSeasonData[index].fields;

				if( playObj[tempObj.user_id] === undefined )
				{
					playObj[tempObj.user_id] = 1;
				}
				else
				{
					playObj[tempObj.user_id]++;
				}
			}

			for( var index in playObj )
			{
				var obj = $("#userId" + stats.member.memberHashKeys[index]);

				obj.text(playObj[index]);
			}
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

