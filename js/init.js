/*
init js
define global var
define function must use global var
*/

var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2,
	color=d3.scale.category20c();
	
var svg=d3.select("body").append("svg")
	.attr("width",width)
	.attr("height",height)
	.append("g")
	.attr("transform","translate("+width/2+","+height*0.52+")");
	
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
	data[i].value=Math.floor(Math.random()*10);
	data[i].depth=0;
	num=3+Math.floor(Math.random()*3);
	data[i].children=new Array();
	for(j=0;j<num;j++)
	{
		data[i].children[j]=new Object();
		data[i].children[j].depth=1;
		data[i].children[j].value=Math.floor(Math.random()*10);
		//data[i].children.children=null;
	}
}

nodes=partition.nodes(data);

var path=svg.selectAll("path")
	.data(partition.nodes(data))
	.enter()
	.append("path")
	.attr("d",arc)
	.attr("display","block")
	.style("stroke","#fff")
	.style("fill",function(d){return color(d.value);})
	.style("fill-rule","evenodd");
	
//var nodes=partition(data).nodes;
//console.log(nodes);
	