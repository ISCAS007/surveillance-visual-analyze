/*
define js function 
*/

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
		.attr("opacity",0.5)
		.attr("width",width[0]+"px")
		.attr("height",height[0]+"px")
		.append("video")
		.attr("id","video")
		.attr("width",width[0]+"px")
		.attr("height",height[0]+"px")
		.attr("controls","controls")
		//.attr("poster","pic/demo.jpg")
		.attr("src","video/14.mp4")
		.attr("opacity",0.5)
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
	  
	  //json 文件可能有问题，强行更改了层次
	  var tmp=new Object({"name":"Category3","children":[root.children[1]]});
	  root.children[1]=tmp;
	  tmp=new Object({"name":"Category4","children":[root.children[3]]});
	  root.children[3]=tmp;
	  
	  node = root;
	  window.global_g1.node=node;
	  window.global_g1.dback=root;
	  window.global_g1.d=new Object();
	  window.global_g1.d=root;
	  window.globaldata=root;
	  
	  var path = sunburst.datum(root).selectAll("path")
		  .data(partition.nodes)
		.enter().append("path")
		  .attr("d", arc)
		  .style("fill", function(d) { 
		  // return color((d.children ? d : d.parent).name); 
		  return color(d.name);
		  })
		  .attr("stroke","white")
		  .attr("stroke-width",3)
		  .on("click", click)
		  .each(stash);
		
	var text=sunburst.selectAll("text")
			.data(partition.nodes(root))
			.enter()
			.append("text")
			.attr("display","none")
			.attr("x",function(d){
				return y(d.y)*Math.cos(x(d.x)-Math.PI/2);
			})
			.attr("y",function(d){
				return y(d.y)*Math.sin(x(d.x)-Math.PI/2);
			})
			.text(function(d){
				var idx=d.name.indexOf("object");
				if(idx==-1)
					return d.name;
				else
					return d.name.substr(idx+6);
			});
	
			
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

function extractData_yzbx(dd,dataset)
{
	if(typeof(dd)=="undefined")
	{
		console.log("bug.........");
		return 0;
	}
	
	if(dd.depth<3)
	{
		var current=dd.children;
		var m;
		len=current.length;
		for(i=0;i<len;i++)
		{
			if(i==0)
				m=extractData_yzbx(current[i],dataset);
			else
				m=Math.max(m,extractData_yzbx(current[i],dataset));
		}
		return m;
	}
	else
	{
		dataset.push(dd);
		return dd.times;
	}
}
	
function drawg2(g,width,height)
{
	// console.log(window.global_g1.d);
	var dataset=new Array();
	var times=extractData_yzbx(window.global_g1.d,dataset);
	var count=dataset.length;

	
	var x = d3.scale.linear()
		.domain([0, count+1])
		.range([0,width[2]])
		.nice();

	var y = d3.scale.linear()
		.domain([0, times+1])
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
		// .attr("stroke","#0f0")
		// .attr("fill","#f00")
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
	
	
	// var dataset=new Array();
	// for(i=0;i<10;i++)
	// {
		// dataset[i]=new Object();
		// dataset[i].x=i;
		// dataset[i].y=Math.random();
	// }

	var line = d3.svg.line()
		.interpolate("linear")
		.x(function(d,i){return x(i);})
		.y(function(d){return y(d.times);});
		
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
this.gesDelete=gesDelete;
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
	if(gnum==1)
	{
		console.log("add sector");
		var current=window.global_g1.d;
		if(typeof(current.children)!="undefined")
		{
			var len=current.children.length;
			current.children[len]=current.children[0];
			current.children[len].name="userDefined";
		}
		else
		{
			childDemo={ name: "object17", times: "3", data: Array[3], address: "5-8" };
			current.children=childDemo;
		}
	}
	
	function click() {
		d=window.global_g1.d;
		
		path=window.global_g1.path;
		path.transition()
		  .duration(1000)
		  .attrTween("d", arcTweenZoom(d));
	}
}
function gesDelete(gnum,g)
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

function result2action(result,from,to,center,_points)
{
	var ges=new gesture();
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
		ges.circleSelect();
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
		ges.lineSelect();
		break;
	}
	case "v":
	{
		ges.add();
		break;
	}
	case "delete":
	{
		ges.gesDelete();
		break;
	}
	case "left curly brace":
	case "right curly brace":
	{
		ges.annotate();
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
		data=root;
	});
	return data;
}