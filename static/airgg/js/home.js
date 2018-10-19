
var home = {};

home.init = function(){
//	home.test();
	home.bestPlayer();
};

home.test = function(){
	$("#btn").click(function(){
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "/player/1",
			success: function(data)
			{
				$("#btn").attr("value",data.rank);
			},
			error: function(e)
			{
				console.log(e.responseText);
			}
		});
	});
};

home.bestPlayer = function(){

	$.ajax({
		type: "GET",
		dataType: "json",
		url: "/static/airgg/riot_api/8.15.1/data/ko_KR/champion/Akali.json",
		success: function(data)
		{
			var championInfo = data.data.Akali;
			var imgOption = {};
			imgOption.src='full';
			imgOption.version='8.15.1';
			imgOption.wrap=2;
			imgOption.skin=1;
			imgOption.gray=false;
			imgOption.size='normal';

			$("#bestChampion").append(Riot.DDragon.fn.getImg(championInfo,imgOption));
			
		},
		error: function(e)
		{
			console.log(e.responseText);
		}
	});
}
