// // @TODO: YOUR CODE HERE!


// set svg and chart dimensions
var svgWidth = 960;
var svgHeight = 500;

// set margin
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// calculate chart height and width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create SVG wrapper and append an SVG group to hold chart
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// retrieve data and cast as numbers
var file = "./assets/data/data.csv"
d3.csv(file).then(function(data) {
    console.log(data);
    data.forEach(d => {
        d.poverty = +d.poverty;
        d.age = +d.age;
        d.income = +d.income;
        d.healthcare = +d.healthcare;
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
    });

    // create scale functions
    var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(data, d => d.poverty)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

      // append axis to chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // append initial circles 
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "green")
    .attr("opacity", ".50")
    .attr("stroke", "black")
  

    // initialize toolTip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
        return (`${d.state}<lr><br>In Poverty: ${d.poverty}%<br> Health Insurance: ${d.healthcare}%`);
        });

    // create toolTip in chart 
    chartGroup.call(toolTip);

    // create event listeners to display and hide toolTip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    // on mouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

     
    chartGroup.selectAll(".dodo")
    .data(data)
    .enter().append("text")
    .attr("class", "dodo")
    .attr("x", function(d) { return xLinearScale(d.poverty); })
    .attr("y", function(d) { return yLinearScale(d.healthcare); })
    .text(function(d) { return d.abbr;})
    .attr("dy", ".5em")
    .attr("dx", "-.5em")
    .attr("fill", "black")
    .attr("text-anchor", "center")
    .attr("font-size", 10);

    // create x-axis and y-axis labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2) - 40)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

    // append x-axis text
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

})