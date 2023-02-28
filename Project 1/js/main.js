
console.log("hello world!");

 d3.csv('data/exoplanets-1.csv') //ASYNCHRONOUS LOADING
  .then(data => {
  	console.log('Data loading complete. Work with dataset.');
    console.log(data);

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function
      	d.sy_snum = +d.sy_snum; // convert string to number
        d.sy_pnum = +d.sy_pnum;
        d.sy_dist = +d.sy_dist;
		d.disc_year = +d.disc_year;
		d.pl_orbsmax = +d.pl_orbsmax;
		d.pl_rade = +d.pl_rade;
		d.pl_bmasse = +d.pl_bmasse;
		d.pl_orbeccen = +d.pl_orbeccen;
		d.st_rad = +d.st_rad;
		d.st_mass = +d.st_mass;
		d.sy_dist = +d.sy_dist;
  	});
	// Initialize and render graphs
	  let starsbargraph = new StarsBargraph({'parentElement': '#starsbargraph'}, data);
	  starsbargraph.updateVis();

	  let planetsbargraph = new PlanetsBargraph({'parentElement': '#planetsbargraph'}, data);
	  planetsbargraph.updateVis();

	  let startypebargraph = new StarTypeBargraph({'parentElement': '#startypebargraph'}, data);
	  startypebargraph.updateVis();

	  let distancehistogram = new DistanceHistogram({'parentElement': '#distancehistogram'}, data);
	  distancehistogram.updateVis();

	  let habitablebargraph = new HabitableBargraph({'parentElement': '#habitablebargraph'}, data);
	  habitablebargraph.updateVis();

	  let discoveriesbargraph = new DiscoveryTypeBargraph({'parentElement': '#discoveriesbargraph'}, data);
	  discoveriesbargraph.updateVis();

	  let radmassscatterplot = new RadMassScatterplot({'parentElement': '#radmassscatterplot'}, data);
	  radmassscatterplot.updateVis();

	  let discoverieslinegraph = new DiscoveriesLinegraph({'parentElement': '#discoverieslinegraph'}, data);
	  discoverieslinegraph.updateVis();
	  
  })
  
  .catch(error => {
    console.error('Error loading the data');
  }); 

 console.log("Please Execute");

function sortInd(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}


