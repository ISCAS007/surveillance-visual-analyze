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
	margin[i]={top: 20, right: 20, bottom: 80, left: 40};
	width[i]=svgwidth/2-margin[i].left-margin[i].right;
	height[i]=svgheight/2-margin[i].top-margin[i].bottom;
	j=i&1;
	k=i&2;
	origin[i]=new Object;
	origin[i].x=j*(svgwidth/2);
	origin[i].y=k*(svgheight/4);
}

var svg=d3.select("body").append("svg")
	.attr("width",svgwidth*2)
	.attr("height",svgheight*2)
	.append("g");

svg.append("rect")
	.attr("width",svgwidth)
	.attr("height",svgheight)
	.attr("class","svg");

var g=new Array();
for(var i=0;i<4;i++)
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
//g2,g3 need draw after g1, so run drawg2,drawg3 in drawg1.
drawg1(g[1],width,height);
