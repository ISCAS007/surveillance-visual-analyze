/*
define js function 
*/

//global var for g1*****
var globaldata;
var globalnode;
var global_g1;


function drawg0(g,width,height)
{
	/*
	<div id="player" class="show" style="position:absolute;left:800;top:400; opacity:1;visibility:hidden;width: 640px; height: 264px;">
    <video id="pp" poster="pic/01-01.jpg"  controls="controls" src="video/1.mp4" type="video/mp4" />
	</div>
	*/
/*	g.append("div")
		.attr("id","player")
		.attr("width",width[0]+"px")
		.attr("height",height[0]+"px")
		.append("video")
		.attr("id","video")
		.attr("poster","pic/demo.jpg")
		.attr("src","video/demo.mp4")
		.attr("type","video/mp4");
		*/
	d3.select("body")
		.append("div")
		.attr("id","player")
		.attr("width",width[0]+"px")
		.attr("height",height[0]+"px")
		.append("video")
		.attr("id","video")
		.attr("width",width[0]+"px")
		.attr("height",height[0]+"px")
		.attr("controls","controls")
		//.attr("poster","pic/demo.jpg")
		.attr("src","video/14.mp4")
		.attr("type","video/mp4");
}

function drawSunburst(sunburst,radius){	
	var color = d3.scale.category20c();
	var x = d3.scale.linear()
		.range([0, 2 * Math.PI]);

	var y = d3.scale.sqrt()
		.range([0, radius]);
		
	var partition = d3.layout.partition()
		.sort(null)
		.value(function(d) { return 1; });

	var arc = d3.svg.arc()
		.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
		.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
		.innerRadius(function(d) { return Math.max(0, y(d.y)); })
		.outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
	
	window.global_g1=new Object();
	window.global_g1.x=x;
	window.global_g1.y=y;
	window.global_g1.arc=arc;
	window.global_g1.radius=radius;
	
	// Keep track of the node that is currently being displayed as the root.
	var node;
	
	d3.json("json/testData2.json", function(error, root) {
	  
	  node = root;
	  window.global_g1.node=node;
	  window.global_g1.dback=root;
	  window.global_g1.d=root;
	  
	  var path = sunburst.datum(root).selectAll("path")
		  .data(partition.nodes)
		.enter().append("path")
		  .attr("d", arc)
		  .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
		  .on("click", click)
		  .each(stash);
		  
	  window.global_g1.path=path;
	  
	  function click(d) {
		window.global_g1.dback=window.global_g1.d;
		window.global_g1.d=d;
		node = d;
		window.global_g1.node=node;
		
		path.transition()
		  .duration(1000)
		  .attrTween("d", arcTweenZoom(d));
	  }
	});

	// d3.select(self.frameElement).style("height", height + "px");

	// Setup for switching data: stash the old values for transition.
	function stash(d) {
	  d.x0 = d.x;
	  d.dx0 = d.dx;
	}

	// When switching data: interpolate the arcs in data space.
	function arcTweenData(a, i) {
	  var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
	  function tween(t) {
		var b = oi(t);
		a.x0 = b.x;
		a.dx0 = b.dx;
		return arc(b);
	  }
	  if (i == 0) {
	   // If we are on the first arc, adjust the x domain to match the root node
	   // at the current zoom level. (We only need to do this once.)
		var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
		return function(t) {
		  x.domain(xd(t));
		  return tween(t);
		};
	  } else {
		return tween;
	  }
}

// When zooming: interpolate the scales.
function arcTweenZoom(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}
}


function drawg1(g,width,height)
{
	
	var radius = Math.min(width[1],height[1])/2;

	tranx=width[1]/2+0;
	trany=height[1]/2+0;
	sunburst=g.append("g")
				.attr("class","g1 sunburst")
				.attr("transform", "translate("+width[1]/2+"," + height[1]/2 + ")");
		
	//var root=new Object();
	//root.children=data;
	//root.key=1;
	
	drawSunburst(sunburst,radius);
}

function drawg2(g,width,height)
{
	var x = d3.scale.linear()
		.domain([0, 10])
		.range([0,width[2]])
		.nice();

	var y = d3.scale.linear()
		.domain([0, 1])
		.range([height[2],0])
		.nice();

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(10)
		.tickSize(height[2]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(5)
		.tickSize(-width[2]);

	g.append("g")
		.attr("class", "x axis")
		.attr("transform","translate("+30+","+10+")")
		.call(xAxis);

	g.append("g")
		.attr("class", "y axis")
		.attr("transform","translate("+30+","+10+")")
		.call(yAxis);
		
	g.append("text")
		.attr("x",width[2]-10)
		.attr("y",height[2]-10)
		.text("object id");
		
	g.append("text")
		.attr("x",30)
		.attr("y",20)
		.text("frequency");
		
	var dataset=new Array();
	for(i=0;i<10;i++)
	{
		dataset[i]=new Object();
		dataset[i].x=i;
		dataset[i].y=Math.random();
	}

	var line = d3.svg.line()
		.interpolate("linear")
		.x(function(d){return x(d.x);})
		.y(function(d){return y(d.y);});
		
	g.append("path")
		.attr("transform","translate("+30+","+10+")")
		.attr("d",line(dataset))
		.attr("class","line")
		.style("fill","none")
		.style("stroke-width",1)
		.style("stroke","#F00")
		.style("stroke-opacity",0.9);
}

function drawg3(g,width,height)
{
	var x = d3.scale.linear()
		.domain([0, 10])
		.range([0,width[2]])
		.nice();

	var y = d3.scale.linear()
		.domain([0, 1])
		.range([height[2],0])
		.nice();

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(10)
		.tickSize(height[2]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(5)
		.tickSize(-width[2]);

	g.append("g")
		.attr("class", "x axis")
		.attr("transform","translate("+30+","+10+")")
		.call(xAxis);

	g.append("g")
		.attr("class", "y axis")
		.attr("transform","translate("+30+","+10+")")
		.call(yAxis);
		
	g.append("text")
		.attr("x",width[2]-10)
		.attr("y",height[2]-10)
		.text("object id");
		
	g.append("text")
		.attr("x",30)
		.attr("y",20)
		.text("frequency");
		
	var dataset=new Array();
	for(i=0;i<10;i++)
	{
		dataset[i]=new Object();
		dataset[i].x=Math.random()*10;
		dataset[i].y=Math.random();
	}

	var line = d3.svg.line()
		.interpolate("linear")
		.x(function(d){return x(d.x);})
		.y(function(d){return y(d.y);});
		
	g.append("path")
		.attr("transform","translate("+30+","+10+")")
		.attr("d",line(dataset))
		.attr("class","line")
		.style("fill","none")
		.style("stroke-width",1)
		.style("stroke","#F00")
		.style("stroke-opacity",0.9);
		
	g.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("transform","translate("+30+","+10+")")
		.attr("cx", function(d,i) {
			return x(d.x);
		})
		.attr("cy", function(d) {
		return y(d.y);
		})
		.attr("r",3)
		.attr("fill","#f00");
}

function gesture()
{
this.singleclick=singleclick;
this.doubleclick=doubleclick;
this.add=add;
this.jesDelete=jesDelete;
this.lineSelect=lineSelect;
this.circleSelect=circleSelect;
this.annotate=annotate;
this.back=back;
this.mouseover=mouseover;
this.mouseleave=mouseleave;
function mouseover(gnum,g)
{
	
}
function mouseleave(gnum,g)
{
	
}
function singleclick(gnum,g)
{
	if(gnum==1)
	{
		
	}
}
function doubleclick(gnum,g)
{

}
function add(gnum,g)
{

}
function jesDelete(gnum,g)
{

}
function lineSelect(gnum,g)
{

}
function circleSelect(gnum,g)
{

}
function annotate(gnum,g)
{

}
function back(gnum,g)
{
	if(gnum==1){
		click();
	}
	
	function click() {
		tmp=window.global_g1.dback;
		window.global_g1.dback=window.global_g1.d;
		window.global_g1.d=tmp;
		
		d=window.global_g1.d;
		
		path=window.global_g1.path;
		path.transition()
		  .duration(1000)
		  .attrTween("d", arcTweenZoom(d));
	}
	
	function arcTweenZoom(d) {
		x=window.global_g1.x;
		y=window.global_g1.y;
		arc=window.global_g1.arc;
		radius=window.global_g1.radius;
		
		
		var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
		yd = d3.interpolate(y.domain(), [d.y, 1]),
		yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
		return function(d, i) {
		return i
		? function(t) { return arc(d); }
		: function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
		};
	}
}

}

function result2action(result,from,to,center)
{
	var jes=gesture();
	console.log(result.Name);
	switch(result.Name){
	case "triangle":
	{
		break;
	}
	case "rectangle":
	{
		break;
	}
	case "circle":
	{
		jes.circleSelect();
		break;
	}
	case "x":
	{
		break;
	}
	case "zig-zag":
	{
		
		break;
	}
	case "check":{
		
		break;
	}
	case "caret":
	case "arrow":
	{
		break;
	}
	case "left square bracket":
	case "right square bracket":
	{
		jes.lineSelect();
		break;
	}
	case "v":
	{
		jes.add();
		break;
	}
	case "delete":
	{
		jes.jesDelete();
		break;
	}
	case "left curly brace":
	case "right curly brace":
	{
		jes.annotate();
		break;
	}
	case "star":
	case "pigtail":
	{
		break;
	}
	default:
		return;
	}
}

function getJsonData()
{
	var data;
	d3.json("json/testData2.json", function(error, root) {
		window.globaldata=root;
		data=root;
	});
	
	return data;
}