
var stats = {};

stats.init = function(){
	var getParams = common.getRequest();

	if ( getParams.type === "unique_title" )
	{
		stats.test(getParams.type);
	}
	else if ( getParams.type === "position_rank" )
	{
		stats.test(getParams.type);
	}
	else if ( getParams.type === "for_manager" )
	{
		stats.test(getParams.type);
	}
	else
	{	
		stats.test("unknown");
	}
};

stats.test = function(text){
	var obj = $("#statsMainDiv");

	obj.append(text);
}
