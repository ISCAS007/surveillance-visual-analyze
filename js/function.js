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
		.attr("width",width[0]+"px")
		.attr("height",height[0]+"px")
		.append("video")
		.attr("id","video")
		.attr("controls","controls")
		.attr("poster","pic/demo.jpg")
		.attr("src","video/demo.mp4")
		.attr("type","video/mp4");
}

function drawg1(g,width,height)
{
	var radius = Math.min(width[1],height[1])/2;
	var	color=d3.scale.category20c();
	var rad = Math.min(width, height) / Math.PI - 25;
	
	var arc=d3.svg.arc()
		.startAngle(function(d){return d.x;})
		.endAngle(function(d){return d.x+d.dx;})
		.innerRadius(function(d){return Math.sqrt(d.y);})
		.outerRadius(function(d){return Math.sqrt(d.y+d.dy);});
		
	var partition=d3.layout.partition()
		.sort(null)
		.size([2*Math.PI,radius*radius])
		.value(function(d){return 1;});

	var data=new Array(10);
	for(i=0;i<10;i++)
	{
		data[i]=new Object();
		data[i].key=2+i;
		//data[i].depth=0;
		num=3+Math.floor(Math.random()*3);
		data[i].children=new Array();
		for(j=0;j<num;j++)
		{
			data[i].children[j]=new Object();
			
			//data[i].children[j].depth=1;
			data[i].children[j].key=10+Math.floor(Math.random()*10);
			//data[i].children.children=null;
		}
	}
	
	tranx=width[1]/2;
	trany=height[1]/2;
	sunburst=g.append("g")
				.attr("class","g1 sunburst")
				.attr("transform", "translate("+width[1]/2+"," + height[1]/2 + ")");
		
	//var root=new Object();
	//root.children=data;
	//root.key=1;
	
	d3.json("json/testData2.json", function(error, root) {
		var jes=new jesture();
		var path=sunburst.datum(root).selectAll("path")
				.data(partition.nodes)
				.enter()
				.append("path")
				.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
				.attr("d", arc)
				.attr("class","g1_arc")
				.style("stroke", "#fff")
				.style("fill", function(d) { return color((d.children ? d : d.parent).name); })
				.style("fill-rule", "evenodd")
				.on("click",jes.singleclick(1,g))
				.on("dblclick",jes.doubleclick(1,g))
				.on("mouseover",jes.mouseover(1,g))
				.on("mouseleave",jes.mouseleave(1,g));
		
	
		/* var text=sunburst.datum(root).selectAll("text")
				.data(partition.nodes)
				.enter()
				.append("text")
				.attr("transform", function (a) {
					var r = 180 * ((a.x + a.dx / 2 - Math.PI / 2) / Math.PI);
					return "rotate(" + r + ")"
				})
				.attr("x", function (a) { return a.x})
				.attr("dx", "6").attr("dy", ".1em").text(function (a) { return a.name })
				.attr("display", function (a) { return a.children ? null : "none" })
				.on("mouseover", jes.mouseover(1,g))
				.on("mouseleave", jes.mouseleave(1,g));  */
	});
		
	
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

function jesture()
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
	
}
}

function result2action(result,from,to,center)
{
	jes=jesture();
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