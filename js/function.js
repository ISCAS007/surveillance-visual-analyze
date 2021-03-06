/*
	define js function
	*/
var globaldata;
var globalnode;
var global_g1;
var global_g2;
var global_g3;

function gesture() {
  this.singleclick = singleclick;
  this.doubleclick = doubleclick;
  this.add = add;
  this.gesDelete = gesDelete;
  this.lineSelect = lineSelect;
  this.circleSelect = circleSelect;
  this.annotate = annotate;
  this.back = back;
  this.mouseover = mouseover;
  this.mouseleave = mouseleave;

  function mouseover(gnum, g) {

  }

  function mouseleave(gnum, g) {

  }

  function singleclick(gnum, g) {
    if (gnum == 1) {

    }
  }

  function doubleclick(gnum, g) {

  }

  function add(gnum, g) {
    if (gnum == 1) {
      console.log("add sector");
      var current = window.global_g1.d;
      if (typeof(current.children) != "undefined") {
        var len = current.children.length;
        current.children[len] = current.children[0];
        current.children[len].name = "userDefined";
      } else {
        childDemo = {
          name: "object17",
          times: "3",
          data: Array[3],
          address: "5-8"
        };
        current.children = childDemo;
      }
    }

    function click() {
      d = window.global_g1.d;

      path = window.global_g1.path;
      path.transition()
        .duration(1000)
        .attrTween("d", arcTweenZoom(d));
    }
  }

  function gesDelete(gnum, g) {

  }

  function lineSelect(gnum, g) {

  }

  function circleSelect(gnum, g) {

  }

  function annotate(gnum, g) {

  }

  function back(gnum, g) {
    if (gnum == 1) {
      click();
    }

    function click() {
      tmp = window.global_g1.dback;
      window.global_g1.dback = window.global_g1.d;
      window.global_g1.d = tmp;

      d = window.global_g1.d;

      path = window.global_g1.path;
      path.transition()
        .duration(1000)
        .attrTween("d", arcTweenZoom(d));


      redrawg2();
      redrawg3();
    }
  }

  function arcTweenZoom(d) {
    x = window.global_g1.x;
    y = window.global_g1.y;
    arc = window.global_g1.arc;
    radius = window.global_g1.radius;


    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
    return function(d, i) {
      return i ? function(t) {
        return arc(d);
      } : function(t) {
        x.domain(xd(t));
        y.domain(yd(t)).range(yr(t));
        return arc(d);
      };
    };
  }
}

function result2action(result, from, to, center, _points) {
  var ges = new gesture();
  console.log(result.Name);
  switch (result.Name) {
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
    case "check":
      {

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

function getJsonData() {
  var data;
  d3.json("json/testData2.json", function(error, root) {
    data = root;
  });
  return data;
}

function drawg0(g, width, height) {
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
    .attr("id", "player")
    .attr("opacity", 0.5)
    .attr("width", width[0] + "px")
    .attr("height", height[0] + "px")
    .append("video")
    .attr("id", "video")
    .attr("width", width[0] + "px")
    .attr("height", height[0] + "px")
    .attr("controls", "controls")
    //.attr("poster","pic/demo.jpg")
    .attr("src", "video/14.mp4")
    .attr("opacity", 0.5)
    .attr("type", "video/mp4");
}

function drawSunburst(sunburst, radius) {
  var color = d3.scale.category20c();
  var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

  var y = d3.scale.sqrt()
    .range([0, radius]);

  var partition = d3.layout.partition()
    .sort(null)
    .value(function(d) {
      return 1;
    });

  var arc = d3.svg.arc()
    .startAngle(function(d) {
      return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
    })
    .endAngle(function(d) {
      return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
    })
    .innerRadius(function(d) {
      return Math.max(0, y(d.y));
    })
    .outerRadius(function(d) {
      return Math.max(0, y(d.y + d.dy));
    });

  var tip = d3.tip()
    .attr('class', 'g1-tip')
    .html(function(d) {
      return '<span>' + d.name + '</span>'
    })
    .offset([0, 0]);

  sunburst.call(tip);

  window.global_g1 = new Object();
  window.global_g1.x = x;
  window.global_g1.y = y;
  window.global_g1.arc = arc;
  window.global_g1.radius = radius;
  window.global_g1.color = color;

  // Keep track of the node that is currently being displayed as the root.
  var node;

  d3.json("json/testData2.json", function(error, root) {

    var tmp = new Object({
      "name": "Category3",
      "children": [root.children[1]]
    });
    root.children[1] = tmp;
    var tmp2 = new Object({
      "name": "Category4",
      "children": [root.children[3]]
    });
    root.children[3] = tmp2;

    node = root;
    window.global_g1.node = node;
    window.global_g1.dback = root;
    window.global_g1.d = root;
    window.globaldata = root;

    var path = sunburst.datum(root).selectAll("path")
      .data(partition.nodes)
      .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) {
        // return color((d.children ? d : d.parent).name);
        return color(d.name);
      })
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .on("click", click)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .each(stash);

    var text = sunburst.selectAll("text")
      .data(partition.nodes(root))
      .enter()
      .append("text")
      .attr("display", "none")
      .attr("x", function(d) {
        return y(d.y) * Math.cos(x(d.x) - Math.PI / 2);
      })
      .attr("y", function(d) {
        return y(d.y) * Math.sin(x(d.x) - Math.PI / 2);
      })
      .text(function(d) {
        var idx = d.name.indexOf("object");
        if (idx == -1)
          return d.name;
        else
          return d.name.substr(idx + 6);
      });


    window.global_g1.path = path;
    drawg2(g[2], width, height);
    drawg3(g[3], width, height);


    function click(d) {
      window.global_g1.dback = window.global_g1.d;
      window.global_g1.d = d;
      node = d;
      window.global_g1.node = node;

      path.transition()
        .duration(1000)
        .attrTween("d", arcTweenZoom(d));

      redrawg2();
      redrawg3();
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
    var oi = d3.interpolate({
      x: a.x0,
      dx: a.dx0
    }, a);

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
      return i ? function(t) {
        return arc(d);
      } : function(t) {
        x.domain(xd(t));
        y.domain(yd(t)).range(yr(t));
        return arc(d);
      };
    };
  }

}

function drawg1(g, width, height) {

  var radius = Math.min(width[1], height[1]) / 2;

  tranx = width[1] / 2 + 0;
  trany = height[1] / 2 + 0;
  sunburst = g.append("g")
    .attr("class", "g1 sunburst")
    .attr("transform", "translate(" + width[1] / 2 + "," + height[1] / 2 +
      ")");

  //var root=new Object();
  //root.children=data;
  //root.key=1;

  drawSunburst(sunburst, radius);
  console.log("draw g1 ok ................");
}

function extractData_yzbx(dd, dataset) {
  if (typeof(dd) == "undefined") {
    console.log("bug.........");
    return 0;
  }

  if (dd.depth < 3) {
    var current = dd.children;
    var m;
    var tmp;
    var len = current.length;

    for (var i = 0; i < len; i++) {
      tmp = extractData_yzbx(current[i], dataset);
      if (isNaN(tmp)) {
        console.log(current[i]);
      }

      if (i == 0) {
        m = tmp;
      } else {
        m = Math.max(m, tmp);
      }
    }
    return m;
  } else {
    dataset.push(dd);
    return dd.times;
  }
}

function drawg2(g, width, height) {
  // console.log(window.global_g1.d);
  var dataset = new Array();
  var times = extractData_yzbx(global_g1.d, dataset);
  var count = dataset.length;

  // g.attr("transform","translate("+30+","+10+")");
  var x = d3.scale.linear()
    .domain([0, count + 1])
    .range([0, width[2]])
    .nice();

  var y = d3.scale.linear()
    .domain([0, times + 1])
    .range([height[2], 0])
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

  var left = margin[3].left,
    top = margin[3].top;
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + left + "," + top + ")")
    // .attr("stroke","#0f0")
    // .attr("fill","#f00")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width[2])
    .attr("y", height[2] - 6)
    .style("text-anchor", "end")
    .text("object id");

  g.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + left + "," + top + ")")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("frequency");

  var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d, i) {
      return x(i);
    })
    .y(function(d) {
      return y(d.times);
    });

  g.append("path")
    .attr("transform", "translate(" + left + "," + top + ")")
    .attr("d", line(dataset))
    .attr("class", "line")
    .style("fill", "none")
    .style("stroke-width", 1)
    .style("stroke", "#F00")
    .style("stroke-opacity", 0.9);

  var color = window.global_g1.color;
  g.selectAll(".dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function(d, i) {
      return x(i);
    })
    .attr("cy", function(d) {
      return y(d.times);
    })
    .attr("transform", "translate(" + left + "," + top + ")")
    .style("fill", function(d) {
      return color(d.name);
    })
    .on("click", click);

  console.log("draw g2 ok ...........");

  function click(d, i) {
    console.log("g2 clicked " + i);
  }
}

function redrawg2() {
  g[2].remove();

  var i = 2;
  g[i] = svg.append("g").attr("id", "g" + i)
    .attr("width", svgwidth / 2)
    .attr("height", svgheight / 2)
    .attr("transform", "translate(" + origin[i].x + "," + origin[i].y + ")");

  g[i].append("rect")
    .attr("class", "boundary")
    .attr("width", svgwidth / 2 - 1)
    .attr("height", svgheight / 2 - 1);

  drawg2(g[2], width, height);
}
