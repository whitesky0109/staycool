
var position = {};

position.team1Prefix = 'team1UserId';
position.team2Prefix = 'team2UserId';

position.init = function (){
	position.getUserIds();
};

position.getUserIds = function () {
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/members/",
		success: function(members)
		{
			var team1Grp = $('#team1Group');
			var team2Grp = $('#team2Group');

			for( var i = 0 ; i < 5; i++ )
			{
				position.creatSelectUser(team1Grp, members, position.team1Prefix + i);
			}

			for( var i = 0 ; i < 5; i++ )
			{
				position.creatSelectUser(team2Grp, members, position.team2Prefix + i);
			}
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
};

position.creatSelectUser = function(obj, members, id){
	var $divTop = $('<div>',{class: 'row input-group ml-2 mt-2 mb-2 pr-4 input-group-lg'});
	var $divAppend = $('<div>',{class:'input-group-append'});
	var $span = $('<span>',{class:'input-group-text'}).text('USER_ID');
	var $selectObj = $('<select>',{class:'form-control', id:id});

	$selectObj.append($('<option>').text('UNKNOWN'));

	for( var index in members )
	{
		var optionObj = $('<option>').text(members[index].pk);
		$selectObj.append(optionObj);
	}

	$divAppend.append($span);
	$divTop.append($divAppend);
	$divTop.append($selectObj);
	obj.append($divTop);
}

position.predict = function()
{
	position.predict.team(1);
	position.predict.team(2);
}

position.predict.team = function(teamNum)
{
	var mostChampDivObj = $('#team' + teamNum + 'MostChampDiv');
	var teamMemberIDs = [  $('#team' + teamNum +'UserId' + '0').val(),
				$('#team' + teamNum +'UserId' + '1').val(),
				$('#team' + teamNum +'UserId' + '2').val(),
				$('#team' + teamNum +'UserId' + '3').val(),
				$('#team' + teamNum +'UserId' + '4').val()];

	mostChampDivObj.empty();

	position.getTeamData(teamNum, mostChampDivObj, teamMemberIDs);
}

position.getTeamData = function(teamNum, obj, memberIDs)
{
	$.ajax ({
		type: "GET",
		dataType: "json",
		url: "/f/team/",
		data:{member0:memberIDs[0],
			member1:memberIDs[1],
			member2:memberIDs[2],
			member3:memberIDs[3],
			member4:memberIDs[4]
		},
		success: function(teamData)
		{
			var imgOption = {'src':'sprite',
					'version':'8.24.1',
					'wrap':2,
					'skin':1,
					'gray':false,
					'size':'normal',
					'classes':'ml-3'};


			var teamChampData = {};
			var teamMostData = {};

			for ( var member of memberIDs )
			{

				if (member === "UNKNOWN") continue;

				var mostData = common.user.summaryMostData(teamData[member]);
				var champData = common.user.summaryChampion(teamData[member]);

				teamMostData[member] = mostData;

				for ( champ in champData )
				{
					if (teamChampData[champ] === undefined || teamChampData[champ] === null)
					{
						teamChampData[champ] = champData[champ];
					}
					else
					{
						teamChampData[champ].kill += champData[champ].kill;
						teamChampData[champ].death += champData[champ].death;
						teamChampData[champ].asist += champData[champ].asist;
						teamChampData[champ].cs += champData[champ].cs;
						teamChampData[champ].win += champData[champ].win;
						teamChampData[champ].play += champData[champ].play;
					}
				}
			}

			var predictLine = position.predictLine(teamMostData);
			for ( var line in predictLine )
			{
				$('#team' + teamNum + 'Predict' + line).text(predictLine[line]);
			}

			var champKeysStWinRatio = Object.keys(teamChampData);
			champKeysStWinRatio.sort(function(a,b){
				if( teamChampData[b].play < 10 )
					return -1;

				if ( teamChampData[a].play < 10 )
					return 1;

				var beta = teamChampData[b].win/teamChampData[b].play;
				var alpha = teamChampData[a].win/teamChampData[a].play;

				return beta - alpha;
			});


			for ( var i = 0 ; i < 5; i++ )
			{
				var champName = champKeysStWinRatio[i];
				common.champion.getImg(obj, champName, imgOption);
			}
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}

position.predictLine = function(teamMostDatas) {
	var predictLine = {'TOP':null,
			   'JUG':null,
			   'MID':null,
			   'BOT':null,
			   'SUP':null};

	var renameMember = {};

	for( var userId in teamMostDatas)
	{
		var curLine = teamMostDatas[userId].line;

		if( predictLine[curLine] === null )
		{
			predictLine[curLine] = userId;
		}
		else
		{
			var alpha = parseFloat(teamMostDatas[predictLine[curLine]].winRatio);
			var beta = parseFloat(teamMostDatas[userId].winRatio);

			if( beta > alpha )
			{
				renameMember[predictLine[curLine]] = teamMostDatas[predictLine[curLine]];
				predictLine[curLine] = userId;
			}
			else
			{
				renameMember[userId] = teamMostDatas[userId];
			}
		}
	}

	for ( var userId in renameMember )
	{
		for( var line in predictLine )
		{
			if ( predictLine[line] === null )
			{
				predictLine[line] = userId;
				break;
			}
		}
	}

	for( var line in predictLine )
	{
		if( predictLine[line] === null )
		{
			predictLine[line] = 'UNKNOWN';
		}
	} 

	return predictLine;
}
