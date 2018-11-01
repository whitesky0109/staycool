
var member = {};

member.positionArr = {TOP:0, JUG:0, MID:0, BOT:0, SUP:0};
member.pieChart = {};

member.init = function(){
	Chart.defaults.global.maintainAspectRatio = false;
	Chart.defaults.global.responsive = false;

	member.initPieChart();
	member.getMembers();
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
		url: "/db/Users/",
		success: function(data)
		{
			var table_body = $("#memberTableBody");

			for( var index in data ) {
				var $memberTableRow = $('<tr>',{'class':'member-table_row'});
				var $memberUserId = $('<td>');
				var $memberUserIdLink = $('<a>',
					{'href':'/airgg/profile/?=' + data[index].user_id,
					 'class':'member-table_link'}).text(data[index].user_id);
				var $memberAge = $('<td>').text(data[index].age);
				var $memberPreferLine = $('<td>').text(data[index].preference_line);
				var $memberName = $('<td>').text(data[index].name);
				var $memberMostChamp = $('<td>');

				$memberUserId.append($memberUserIdLink);

				$memberTableRow.append($memberUserId);
				$memberTableRow.append($memberName);
				$memberTableRow.append($memberAge);
				$memberTableRow.append($memberPreferLine);
				$memberTableRow.append($memberMostChamp);
				table_body.append($memberTableRow);

				member.setPositionArr(data[index].preference_line);
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

