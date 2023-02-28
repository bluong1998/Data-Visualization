class RadMassScatterplot {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {

      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 600,
        containerHeight: _config.containerHeight || 320,
        margin: _config.margin || {top: 40, right: 20, bottom: 55, left: 70}
      }
      this.data = _data;
      this.initVis();
    }
    
    initVis() {

      let vis = this;
  
      // Calculate inner chart size.
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      // Initialize scales
      vis.colorScale = d3.scaleOrdinal()
          .range(['#812AAA']) 
  
      vis.xScale = d3.scaleLinear()
          .range([0, vis.width]);
  
      vis.yScale = d3.scaleLinear()
          .range([vis.height, 0]);
  
      // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale)
          .ticks(6)
          .tickSize(-vis.height - 10)
          .tickPadding(10);
  
      vis.yAxis = d3.axisLeft(vis.yScale)
          .ticks(6)
          .tickSize(-vis.width - 10)
          .tickPadding(10);
  
      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // Append group element that will contain our actual chart 
      // and position it according to the given margin config
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      // Append empty x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.height})`);
      
      // Append y-axis group
      vis.yAxisG = vis.chart.append('g')
          .attr('class', 'axis y-axis');
  
      // Append axis title and labels
      vis.chart.append('text')
          .attr('class', 'axis-title')
          .attr('y', vis.height + 20)
          .attr('x', vis.width + -200)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Radius');
  
      vis.svg.append('text')
          .attr('class', 'axis-title')
          .attr('x', -210)
          .attr('y', 10)
          .attr('dy', '.71em')
          .attr("dx", "-.8em")
          .attr("transform", "rotate(-90)")
          .text('Mass');

      vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', 150)
        .attr('y', 5)
        .attr('dy', '.71em')
        .text('Exoplanets by Mass and Radius (in relation to Earth)');
    }
  
   
    updateVis() {
      let vis = this;
      
      // Specificy accessor functions
      vis.colorValue = d => d.time;
      vis.xValue = d => d.pl_rade;
      vis.yValue = d => d.pl_bmasse;
  
      // Set the scale input domains
      vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
      vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);
  
      vis.renderVis();
    }
  
    renderVis() {
      let vis = this;
  
      // Add circles
      vis.chart.selectAll('.point')
          .data(vis.data)
          .enter()
        .append('circle')
          .attr('class', 'point')
          .attr('r', 4)
          .attr('cy', d => vis.yScale(vis.yValue(d)))
          .attr('cx', d => vis.xScale(vis.xValue(d)))
          .attr('fill', d => vis.colorScale(vis.colorValue(d)));
      
      // Update the axes/gridlines
      // We use the second .call() to remove the axis and just show gridlines
      vis.xAxisG
          .call(vis.xAxis)
          .call(g => g.select('.domain').remove());
  
      vis.yAxisG
          .call(vis.yAxis)
          .call(g => g.select('.domain').remove())
    }
  }