
var member = {};

member.positionArr = {TOP:0, JUG:0, MID:0, BOT:0, SUP:0};
member.pieChart = {};

member.init = function(){
	Chart.defaults.global.maintainAspectRatio = false;
	Chart.defaults.global.responsive = false;

	member.initPieChart();
	member.getMembers();

	common.version();
};

member.setPositionArr = function(line) {
	member.positionArr[line] = member.positionArr[line]+1;
//	console.log(line + ":"  + member.positionArr[line]);
}

member.initPieChart = function () {
	var ctx = $('#mostLinePie');
	var mostLineArr = {
		datasets:[{
			backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
			hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
		}],
	}

	member.pieChart = new Chart(ctx,{
		type: 'pie',
		data: mostLineArr,
		options:{
			title: {
				display: true,
			},
			animation: {
				animateScale: true,
			},
		}
	});
};

member.addDataPieChart = function (chart, label, data) {
	chart.data.labels.push(label);
	chart.data.datasets.forEach((dataset) => {
		dataset.data.push(data);
	});
}

member.updateTitlePieChart = function(chart, text)
{
	chart.options.title.text = text;
}

member.getMembers = function(){

	$.ajax({
		type: "GET",
		dataType: "json",
		url: "/f/members/",
		success: function(data)
		{
			var table_body = $("#memberTableBody");

			for( var index in data ) {
				var user_id = data[index].pk;
				var userFields = data[index].fields;

				var $memberTableRow = $('<tr>',{'class':'member-table_row'});
				var $memberUserId = $('<td>');
				var $memberUserIdLink = $('<a>',
					{'href':'/profile/?userName=' + user_id,
					 'class':'member-table_link'}).text(user_id);
				var $memberPreferLine = $('<td>').text(userFields.preference_line);
				var $memberTitle = $('<td>');
				var $memberTitleBadge = $('<span>');

				if( userFields.position == "master")
				{
					$memberTitleBadge.attr('class','badge badge-success');
				}
				else if ( userFields.position == "manager" )
				{
					$memberTitleBadge.attr('class','badge badge-warning');
				}
				else
				{
					$memberTitleBadge.attr('class','badge badge-primary');
				}
				
				$memberTitleBadge.text(userFields.position);

				$memberUserId.append($memberUserIdLink);
				$memberTitle.append($memberTitleBadge);

				$memberTableRow.append($memberUserId);
				$memberTableRow.append($memberTitle);
				$memberTableRow.append($memberPreferLine);
				table_body.append($memberTableRow);

				member.setPositionArr(userFields.preference_line);
			}

			member.updateTitlePieChart(member.pieChart, "Total member: " + data.length);
			member.addDataPieChart(member.pieChart, 'TOP', member.positionArr["TOP"]);
			member.addDataPieChart(member.pieChart, 'JUG', member.positionArr["JUG"]);
			member.addDataPieChart(member.pieChart, 'MID', member.positionArr["MID"]);
			member.addDataPieChart(member.pieChart, 'BOT', member.positionArr["BOT"]);
			member.addDataPieChart(member.pieChart, 'SUP', member.positionArr["SUP"]);
			member.pieChart.update();
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
};

