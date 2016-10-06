$(document).ready(function() {

	// setup
	var el = '#map'
	var width = (0.95 * $(el).width()),
        height = (0.55 * width),
        projScale = Math.min(1560,($(el).width()/5.75));
        projScale = 300,
        active = d3.select(null);

    // d3 selection of our DOM element housing the visualization
    var svg = d3.select(el).append("svg")
    	.attr('class','map-svg')
        .attr("width", width)
        .attr("height", height)
        .append('g').attr('class','world-map');
        
    /*var projection = d3.geo.mercator()
                       .translate([width / 2, height / 2.25 + 0])
                       .scale(projScale).clipExtent([
                                      [0, 0],
                                      [width, height]
                          ]);*/
	// projection function
	var projection = d3.geo.mercator()
	                 .scale(5100)
	                 .translate([-2000, 4000]);

	// svg mini language path generator (creates d attr in path elements)
    var path = d3.geo.path()
                  .projection(projection);
    // console.log('path func', path);

    // used to definie opacity for a path element
    var fillOpac = d3.scale.linear();

    // our div that will float around the page with the mouse
    var tooltip = d3.select('#tooltip');

    // main piece of the app.. get the geoJSON feature data
    // callback runs when the data comes back and builds our map
    d3.json('izmir-districts.geo.json', function(data) {

    	// select all the districts (zero at first), bind data, enter() to get new elements
    	// then use path method to get our d attr
    	// then style and add events
    	svg.selectAll('.district')
                .data(data.features)
                .enter().append("path")
                .attr("d", function(d) { return path(d)} )
                .attr("class", "district")
                .style({'stroke':'#ccc', 'stroke-width':'.25px'})
                .style('fill', function(d) { return 'steelblue' })
                .style('fill-opacity', function(d) {
                	return fillOpac(Math.random());
                })
                .on("mouseover", function(d) {                           
                			d3.select(this).style({'stroke-width':'1px','stroke':'#777'});
	                        tooltip.style('display', 'block')
	                               .style("left", (window.innerWidth*0.80 > d3.event.pageX ? (d3.event.pageX+5) : (d3.event.pageX-255)) + "px")
	                               .style("top", (d3.event.pageY-50) + "px");
	                        tooltip.select('.tooltip-header').html('<h5>' + (d.properties.NAME_0) + '</h5>');
	                        tooltip.select('.tooltip-body').html(
	                        	'<p>Metrics, text, images or graphs here drilling into this district</p>'
	                        	)
		                    	})
		                     .on("mouseout", function(d) {   
		                    d3.select(this).style({'stroke':'#ccc', 'stroke-width':'.5px'});                     
	                        tooltip.style('display', 'none');

	                    })
		        .on("mousemove", function(d) {                           
                			d3.select(this).style({'stroke-width':'.75px','stroke':'#777'});
	                        tooltip.style('display', 'block')
	                               .style("left", (window.innerWidth*0.80 > d3.event.pageX ? (d3.event.pageX+5) : (d3.event.pageX-255)) + "px")
	                               .style("top", (d3.event.pageY-50) + "px");
	                        tooltip.select('.tooltip-header').html('<h5>' + (d.properties.NAME_0) + '</h5>');
	                        tooltip.select('.tooltip-body').html(
	                        	'<p>Metrics, text, images or graphs here drilling into this district</p>'
	                        	)
		                    	})
		                     .on("mouseout", function(d) {   
		                    d3.select(this).style({'stroke':'#ccc', 'stroke-width':'.5px'});                     
	                        tooltip.style('display', 'none');

	                    });

		// ok, it's rendered, scale it to fit
	var bbox = d3.select('.world-map').node().getBBox();
	var dx = bbox.width;
	var dy = bbox.height;
	var x = (bbox.x + bbox.x+bbox.width)/2;
	var y = (bbox.y + bbox.y+bbox.height)/2;
	var scale = .85 / Math.max(dx / width, dy / height);
	var translate = [width / 2 - scale * x, height / 2 - scale * y];

	// console.log(dx, dy, x, y)

	d3.select('.world-map').transition()
	      .duration(1000)
	      .style("stroke-width", 1.5 / scale + "px")
	      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

    });


    
})