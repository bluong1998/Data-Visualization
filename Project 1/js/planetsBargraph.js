class PlanetsBargraph {
  
  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    // Configuration object with defaults
    this.config = {
      parentElement: _config.parentElement,
      colorScale: _config.colorScale,
      containerWidth: _config.containerWidth || 300,
      containerHeight: _config.containerHeight || 320,
      margin: _config.margin || {top: 25, right: 20, bottom: 40, left: 60},
    }
    this.data = _data;
    this.initVis();
  }
  
  /**
   * Initialize scales/axes and append static elements, such as axis titles
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
    // Initialize scales
    vis.colorScale = d3.scaleOrdinal()
        .range(['#812AAA']) 
        .domain(['1','2','3','4','5','6','7','8']);
    
    // Important: we flip array elements in the y output range to position the rectangles correctly
    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]) 

    vis.xScale = d3.scaleBand()
        .range([5, vis.width])
        .paddingInner(0.2);

    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(8)
        .tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSizeOuter(0)

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
        .attr('x', 30)
        .attr('y', 5)
        .attr('dy', '.71em')
        .text("Number of Planets in Exoplanet Systems");

      vis.svg.append('text')
        .attr('class', 'x-label')
        .attr('x', 140)
        .attr('y', 300)
        .attr('dy', '.71em')
        .text('Planets');

    vis.svg.append('text')
        .attr('class', 'y-label')
        .attr('x', -200)
        .attr('y', 5)
        .attr('dy', '.71em')
        .attr('transform','rotate(-90)')
        .text('Exoplanet Systems');
  }

  /**
   * Prepare data and scales before we render it
   */
  updateVis() {
    let vis = this;

    // Prepare data: count number of stars for each exoplanet
    const aggregatedDataMap = d3.rollups(vis.data, v => v.length, d => d.sy_pnum);
    aggregatedDataMap.sort(sortInd);
    vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));

    

    // Specificy accessor functions
    vis.colorValue = d => d.key;
    vis.xValue = d => d.key;
    vis.yValue = d => d.count;

    // Set the scale input domains
    vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
    vis.yScale.domain([0, d3.max(vis.aggregatedData, vis.yValue)]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements
   */
  renderVis() {
    let vis = this;

    // Add rectangles
    const bars = vis.chart.selectAll('.bar')
        .data(vis.aggregatedData, vis.xValue)
      .join('rect')
        .attr('class', 'bar')
        .attr('x', d => vis.xScale(vis.xValue(d)))
        .attr('width', vis.xScale.bandwidth())
        .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
        .attr('y', d => vis.yScale(vis.yValue(d)))
        .attr('fill', d => vis.colorScale(vis.colorValue(d)));

    // Update axes
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
  
}