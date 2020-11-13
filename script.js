var margin = ({top: 20, right: 50, bottom: 50, left: 50});
var width = 850 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3
    .scaleLinear()
    .range([0, width])
    .nice();

const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .nice();

d3.csv('driving.csv', d3.autoType).then(data =>{
    console.log(data);

    xScale.domain([d3.min(data, function(d) { return d.miles; }) - 200, d3.max(data, function(d) { return d.miles; }) + 200]);
    yScale.domain([d3.min(data, function(d) { return d.gas; }) - .2, d3.max(data, function(d) { return d.gas; }) + .2]);

    const xAxis = d3.axisBottom()
        .ticks(5)
        .scale(xScale);

    const xAxisGroup = svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    svg.append("text")
        .attr("class", "axlabel")
        .attr('x', width - 170)
        .attr('y', height - 10)
        .text("Cost per Person per Year");
        
    const yAxis = d3.axisLeft()
        .ticks(12, "$.2f")
        .scale(yScale);

    const yAxisGroup = svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);

    svg.append("text")
        .attr("class", "axlabel")
        .attr('x', 10)
        .attr('y', 30)
        .text("Cost per Gallon");
    
    yAxisGroup.select(".domain").remove();
    yAxisGroup.selectAll(".tick line")
        .clone()
        .attr("x2", width)
        .attr("stroke-opacity", 0.1);

    xAxisGroup.select(".domain").remove();
    xAxisGroup.selectAll(".tick line")
        .clone()
        .attr("y2", -height)
        .attr("stroke-opacity", 0.1);

    const line = d3
        .line()
        .x(d => xScale(d.miles))
        .y(d => yScale(d.gas));

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr("stroke", 'black')
        .attr("stroke-width", "2px")
        .attr("d", line);

    const dots = svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter();
    
    const plot = dots
        .append('circle')
        .attr('cx', function (d) { return xScale(d.miles); } )
        .attr('cy', function (d) { return yScale(d.gas); } )
        .attr("r", 5)
        .style("stroke", "black")
        .style("fill", "white");
    
    const labels = dots
        .append("text").text(function(d){
            return d.year;
        })
        .attr('x', function (d) {
            return xScale(d.miles);
        })
        .attr('y', function (d) {
            return yScale(d.gas);
        })
        .each(position)
        .call(halo);

});

function position(d) {
    const t = d3.select(this);
    switch (d.side) {
      case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
      case "right":
        t.attr("dx", "0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "start");
        break;
      case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
      case "left":
        t.attr("dx", "-0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "end");
        break;
    }
}

function halo(text) {
    text
        .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
        })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round");
    }