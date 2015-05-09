function drawg3(g, width, height) {
  var x = d3.time.scale()
    // .domain([0, 10])
    .domain([new Date(2015, 1, 23, 0), new Date(2015, 1, 23, 0, 1440)])
    .range([0, width[2]])
    .nice();

  var y = d3.scale.linear()
    // .domain([0, 1])
    .domain([0, 6])
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
    // .attr("transform", "rotate(-90)")
    .tickSize(-width[2]);

  var left = margin[3].left,
    top = margin[3].top;
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + left + "," + top + ")")
    .call(xAxis)
    .selectAll(".tick text")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .attr("x", -height[2])
    .attr("y", 0)
    .attr("transform", "rotate(-90)");

  g.append("text")
    .attr("transform", "translate(" + left + "," + top + ")")
    .attr("class", "label")
    .attr("x", width[2])
    .attr("y", height[2] - 6)
    .style("text-anchor", "end")
    .text("scene id");

  g.append("text")
    .attr("class", 'g3-tip')
    .attr("transform", "translate(" + left + "," + top + ")")
    .attr("x", width[2])
    .attr("y", 6)
    .style("text-anchor", "end")
    .text("object i");

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
    .text("date");


  line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) {
      return x(d.x);
    })
    .y(function(d) {
      return y(d.y);
    });
  window.global_g3 = new Object;
  window.global_g3.tip = tip;
  window.global_g3.line = line;
  window.global_g3.color = window.global_g1.color;

  var root = window.globaldata;
  var d = window.global_g1.d;

  if (d.name.substring(0, 3) == "sen") {
    var final = new Array();

    var paths = new Array();
    for (var i = 0; i < d.children.length; i++) {

      var path_data = {
        id: 0,
        name: "",
        data: []
      };
      path_data.id = d.children[i].name.charAt(d.children[i].name.length - 1);
      path_data.name = d.children[i].name;
      path_data.data = searchSence(root, d.children[i]);
      // addPath(path_data);
      paths.push(path_data);
      final = final.concat(path_data.data);
    }

    addPath(paths);
    addDot(final)
  } else if (d.name.substring(0, 3) == "obj") {

    var path_data = {
      id: 0,
      name: "",
      data: []
    };
    path_data.id = d.name.charAt(d.name.length - 1);
    path_data.name = d.name;
    path_data.data = searchSence(root, d);
    addPath([path_data]);
    addDot(path_data.data);
  } else {
    console.log("in drawg3 d is ");
    console.log(d);
  }

}

function addPath(paths) {
  g3 = g[3];
  var left = margin[3].left,
    top = margin[3].top;
  line = window.global_g3.line;
  color = window.global_g3.color;
  tip = window.global_g3.tip;

  // g3.selectAll("path.line")
  //   .data(d.data)
  //   .enter()

  g3.selectAll("path.line").remove();

  g3.selectAll("path.line")
    .data(paths)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return line(d.data);
    })
    .attr("fill", "none")
    .attr("transform", "translate(" + left + "," + top + ")")
    .style("stroke", function(d) {
      return color(d.name);
    })
    .style("stroke-width", 3)
    .on("mouseover", function(d) {
      console.log("mouseover " + d.name);
      d3.select(".g3-tip").text(d.name);
    })
    .on("mouseout", function(d) {
      console.log("mouse out " + d.name);
    });

  // g3.append("path")
  //   .attr("class", "line")
  //   .attr("d", line(d.data))
  //   .attr("fill", "none")
  //   .attr("yzbx", d.name)
  //   .attr("transform", "translate(" + left + "," + top + ")")
  //   .style("stroke", color(d.name))
  //   .style("stroke-width", 3)
  //   .on("mouseover", pathOver())
  //   .on("mouseout", pathLeave());
}

function addDot(data) {
  g3 = g[3];
  line = window.global_g3.line;
  var left = margin[3].left,
    top = margin[3].top;
  g3.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("transform", "translate(" + left + "," + top + ")")
    .attr("class", "dot")
    .attr("fill", "blue")
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 3.5);
}


function searchSence(r, obj) {
  var result = new Array();
  for (var i = 0; i < r.children.length; i++) {
    if (r.children[i].name.substring(0, 3) == "Cat") {
      for (var j = 0; j < r.children[i].children.length; j++) {
        result = result.concat(searchObject(r.children[i].children[j], obj));
      }
    }
    if (r.children[i].name.substring(0, 3) == "sen")
      result = result.concat(searchObject(r.children[i], obj));
  }
  return result;
}

//r is scene
function searchObject(r, obj) {
  var dataset = new Array();
  var x_max = new Date(2015, 1, 1, 0, 0);
  var y_max = -1;
  var i = parseInt(r.name.substring(3, r.name.length));
  for (var j = 0; j < r.children.length; j++) {
    if (r.children[j].name == obj.name) {
      var tmp = r.children[j];
      if (tmp.times > 1) {
        for (var k = 0; k < tmp.times; k++) {
          var d = new Object();
          // d.push(new Date(tmp.data[k][0], tmp.data[k][1], tmp.data[k][2], tmp
          //   .data[
          //     k][3], tmp.data[k][4]));
          // d.push(i);
          d.x = new Date(tmp.data[k][0], tmp.data[k][1], tmp.data[k][2], tmp
            .data[k][3], tmp.data[k][4]);
          d.y = i;
          dataset.push(d);
        }
      } else {
        var d = new Object();
        // d.push(new Date(tmp.data[0], tmp.data[1], tmp.data[2], tmp.data[3],
        //   tmp.data[
        //     4]));
        // d.push(i);
        d.x = new Date(tmp.data[0], tmp.data[1], tmp.data[2], tmp.data[3],
          tmp.data[
            4]);
        d.y = i;
        dataset.push(d);
      }

    }
  }

  dataset.sort(function(a, b) {
    return a.x > b.x ? 1 : -1;
  });
  return dataset;
}

function initg3() {
  g[3].remove();

  var i = 3;
  g[i] = svg.append("g").attr("id", "g" + i)
    .attr("width", svgwidth / 2)
    .attr("height", svgheight / 2)
    .attr("transform", "translate(" + origin[i].x + "," + origin[i].y + ")");

  g[i].append("rect")
    .attr("class", "boundary")
    .attr("width", svgwidth / 2 - 1)
    .attr("height", svgheight / 2 - 1);
}

function redrawg3() {
  initg3();
  drawg3(g[3], width, height);
}
