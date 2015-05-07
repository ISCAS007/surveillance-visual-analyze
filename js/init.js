/*
init js
define global var
define function must use global var
*/

var svgwidth = 960,svgheight = 700;
var margin = new Array();
var width=new Array();
var height=new Array();
var origin=new Array();

//global var for g1*****
// getJsonData();
for(var i=0;i<4;i++)
{
	margin[i]={top: 20, right: 20, bottom: 30, left: 40};
	width[i]=svgwidth/2-margin[i].left-margin[i].right;
	height[i]=svgheight/2-margin[i].top-margin[i].bottom;
	j=i&1;
	k=i&2;
	origin[i]=new Object;
	origin[i].x=j*(svgwidth/2);
	origin[i].y=k*(svgheight/4);
}
	
var svg=d3.select("body").append("svg")
	.attr("width",svgwidth)
	.attr("height",svgheight)
	.append("g");

svg.append("rect")
	.attr("width",svgwidth)
	.attr("height",svgheight)
	.attr("class","svg");
	
var g=new Array();
for(i=0;i<4;i++)
{
	
	g[i]=svg.append("g").attr("id","g"+i)
		.attr("width",svgwidth/2)
		.attr("height",svgheight/2)
		.attr("transform", "translate("+origin[i].x+"," + origin[i].y + ")");	
		
	g[i].append("rect")
		.attr("class","boundary")
		.attr("width",svgwidth/2-1)
		.attr("height",svgheight/2-1);
		
}
	
drawg0(g[0],width,height);
drawg1(g[1],width,height);

// console.log(global_g1);
// console.log(global_d);
// a=global_g1.d;
// console.log(a);
// drawg2(g[2],width,height);
// drawg3(g[3],width,height);

// svg.append("text")
	// .attr("id","gesture_tooltip")
	// .attr("position","fixed")
	// .text("tooltip...")
	// .style("left","0px")
	// .style("bottom","0px");
/* global gesture object and funciton */
	