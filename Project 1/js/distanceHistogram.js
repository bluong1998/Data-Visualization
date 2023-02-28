class DistanceHistogram {
    
  constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 400,
        containerHeight: _config.containerHeight || 320,
        margin: {top: 25, right: 20, bottom: 40, left: 55}
      }
  
      this.data = _data;

      this.initVis();
  }

  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Initialize scales
    vis.colorScale = d3.scaleOrdinal()
      .range(['#812AAA']); 

    vis.xScale = d3.scaleLinear()
      .range([5, vis.width]);

    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .tickSizeOuter(0);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);

    // Append y-axis group 
    vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis');

    // Append axis title
    vis.svg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 100)
      .attr('y', 5)
      .attr('dy', '.71em')
      .text('Exoplanets by Distance from Earth');

    vis.svg.append('text')
      .attr('class', 'x-label')
      .attr('x', 170)
      .attr('y', 300)
      .attr('dy', '.71em')
      .text('Exoplanets');

    vis.svg.append('text')
      .attr('class', 'y-label')
      .attr('x', -220)
      .attr('y', 5)
      .attr('dy', '.71em')
      .attr('transform','rotate(-90)')
      .text('Distance from Earth (Pc)');
      
      this.updateVis()
  }

  updateVis() {
    let vis = this;

    vis.xScale.domain([0, d3.max(vis.data, function(d) { return d.sy_dist })]);

    // set the parameters for the histogram
    var histogram = d3.histogram()
      .value(function(d) { return d.sy_dist; })   // I need to give the vector of value
      .domain(vis.xScale.domain())  // then the domain of the graphic
      .thresholds(vis.xScale.ticks(70)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(vis.data);

    // Set the scale input domains
    vis.yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);

    console.log(bins, vis.xScale.domain(), vis.yScale.domain(), vis.xScale);
    console.log('test')

    // append the bar rectangles to the svg element
    vis.svg.selectAll("rect")
    .data(bins)
      .enter()
    .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + (vis.xScale(d.x0) + 54) + "," + (vis.yScale(d.length) + 25) + ")"; })
      .attr("width", function(d) { return vis.xScale(d.x1) - vis.xScale(d.x0) ; })
      .attr("height", function(d) { return vis.height - vis.yScale(d.length) ; })
      .style("fill", '#812AAA');

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    // Update axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}