var dataset = [
	{
	 "section": "Cake",
	 "skills": [
	      {"name": "Cookies","level": 10},
	      {"name": "Pies","level": 20},
	      {"name": "Ice Cream","level": 30},
	      {"name": "Pancakes","level": 50}
	  ]
  },
	{
	 "section": "Colors",
	 "skills": [
	      {"name": "Red","level": 90},
	      {"name": "Orange","level": 100},
	      {"name": "Yellow","level": 30},
	      {"name": "White","level": 10}
	  ]
	},
	{
	 "section": "Animals",
	 "skills": [
	      {"name": "Cats","level": 50},
	      {"name": "Horse","level": 40},
	      {"name": "Cow","level": 5}
	  ]
	},
	{
	"section": "Exploding kittens",
	"skills": [
		{"name": "Defuse","level": 100},
		{"name": "Nope","level": 50},
		{"name": "See the future","level": 80},
		{"name": "Shuffle","level": 50},
		{"name": "Pairs","level": 20}
	]
	},
  	{
  	 "section": "Drinks",
  	 "skills": [
  	      {"name": "Wine","level": 70},
  	      {"name": "Beer","level": 100},
  	      {"name": "Lemonade","level": 20}
  	  ]
  },
  {
	"section": "Adobe",
	"skills": [
	  {"name": "Photoshop","level": 30},
	  {"name": "Premiere Pro","level": 20},
	  {"name": "After Effects","level": 80},
	  {"name": "In Design","level": 10}
	]
  }
];

//Width and height
var w = 600;
var h = 500;
var barHeight = 8;
var paddingSection = 5;
var radius = 150; //rayon*2+2*chartWdith =w if you want charts to adapt to width
var paddingRadius = 25;
var chartWidth = 100; //bar charts width

var angles = [];
var yScales = [];
var yAxisDefs = [];

//Create SVG, and diameters container
var skills = d3.select('#chart')
	            .append('svg')
	            .attr('width',w)
	            .attr('height',h)
					.append('g')
					.attr("id","skills")
					.attr('transform','translate('+ w/2 +','+ h/2 +')')
						.append('g')
						.attr('id','diameters');

//Create scales
var xScale =  d3.scale.linear()
                        .domain([0,100])
						.range([0,chartWidth]);

var colorScale=d3.scale.linear()
                    .domain([0,100])
                    .rangeRound([255,100]);

//Create one scale Y function for each section
//yScales and yAxisDefs contain one scale per section

dataset.forEach(function(item){
		//Grab all the skill names for one section
		var domain = [];
		item.skills.forEach(function(skill){
			domain.push(skill.name);
		});

		var sectionHeight = (barHeight+ paddingSection)*(item.skills.length) + paddingSection; //Height of the section and inbetween. paddingSection needs to be in factor of the number of skills to represent;
																			   //otherwise a section with few skills will have more whitespace than one with lot of skills.

		//Create scale per section
        var yScale =  d3.scale.ordinal()
		                        .domain(domain)
		                        .rangeBands([0,sectionHeight], 0.4,0.2); //barHeight*(item.skills.length)

		//Define Y axis based on scale per section
		var yAxisDef = d3.svg.axis()
						  .scale(yScale)
						  .orient("left")
						  .ticks(item.skills.length)
						  .tickSize(0);

		yScales.push(yScale);
		yAxisDefs.push(yAxisDef);
});

//Create containers for the sections
var skillContainer = d3.select('#skills').selectAll('g.skillContainer')
											.data(dataset);

							skillContainer.enter()
											.append('g')
											.each(function(d, i) { d.index = i; }) //Need the index to be accessible from children node later
											.attr('class',function(d){return d.section + ' skillContainer';});

//Create nested bar containers
skillContainer.append('g')
		.attr('class','bars')
		.attr('transform',function(d,i){
			var angle = -((360*i)/dataset.length-180); //Parent container gets rotated; but content should not. Counter rotate here.
			return 'rotate('+ angle +')';});

//Create bars
var skillBars = d3.selectAll('g.skillContainer').selectAll('g.bars').selectAll('rect')
								.data(function(d){return d.skills;})
								.enter()
  									.append('rect')
									.attr("x",0)
				                   	.attr("y", function(d,i) { return yScales[d3.select(this.parentNode).datum().index](d.name); }) //i = index of the skills so 0 1 2 3 0 1 2 3 etc. We need the parent node index to call the same yScale for the whole section.
				                   	.attr("height",barHeight) //function(d,i){ return yScales[d3.select(this.parentNode).datum().index].rangeBand();}
				                   	.attr("width", 0)
									.attr('fill',function(d){return 'rgb('+colorScale(d.level)+','+colorScale(d.level)+','+colorScale(d.level)+')';})
									.transition()
						                .duration(1000)
						                .delay(function(d,i){
						                    return 950+i*100;
						                })
										.attr("width", function(d){return xScale(d.level);});

//Create axis container and axis
var yAxis = d3.selectAll('g.skillContainer')
				.append('g')
				.attr("class", "y axis")
				.transition()
				.duration(1000)
				.attr('transform',function(d,i){
					var angle = -((360*i)/dataset.length-180);
					return 'rotate('+ angle +')';})
				.each(function(d,i){
					return d3.select(this).call(yAxisDefs[i]);
					}
				);

//Rotate and translate containers for the circle pattern
skillContainer.attr('opacity',0)
				.transition()
				.duration(1000)
				.attr('opacity',1)
				.attr('transform',function(d,i){
						//Angle of container rotation
						var angle = (360*i)/dataset.length-180;
						//g container of the axis for the current section
						var curSection = d3.select(this).select('g.y.axis');
						//Height of each section
						var sectionHeight = (barHeight+ paddingSection)*(d.skills.length) + paddingSection;

						//ytranslate defines how much you need to translate on y to have
						//- the top left corner of the charts on the circle for the ones in the bottom section (angle < 0)
						//- the below left corner of the chqrts on the circle for the ones in the top section (angle > 0)
						//- alignment in the middle for the one on the horizontal axe (angle = 0 or 180 or -180)
						var ytranslate = function(){
							if ((angle % 180 === 0) || (angle === 0)){
								return -sectionHeight/2;
							} else if (angle>0) {
								return 0;
							} else if (angle<0) {
								return -sectionHeight;
							}
						}();

						//xtranslate defines how much you need to translate sections on the horizontal diameter
						var xtranslate = function(){
							//Section on the left, on horizontal diameter, pushing the section to the left depending on bar size
							if (angle === -180) {
								return xScale(d3.max(d.skills,function(k){return k.level;})); //Max size of the bars for the chart on the left/horizontal
							}
							//Section on the right; on horizontal diameter; pushing the section to the right depending on axis container width
							else if (angle === 0) {
								 return curSection.node().getBBox().width;
							}
							else {
								return 0;
							}
						}();

						//Translate on y, then rotate containers, then translate along x to move along the radius + eventual x adjustements for horizontal diameter
						return 'translate(0,'+ ytranslate +') rotate('+ angle +') translate('+ (radius + xtranslate) +')';
					});




//Create diameters
var diameters = d3.select('g#diameters')
							.attr('class','diameters')
							.selectAll('line')
							.data(dataset)
							.enter()
								.append('line')
									.attr('x1',0)
									.attr('y1',0)
									.attr('x2',radius-paddingRadius)
									.attr('y2',0)
									.attr('opacity',0.5)
									.attr('transform',function(d,i){
										//Angle of container rotation
										var angle = (360*i)/dataset.length-180 + 90;
										return 'rotate('+angle+')';
									})
									.transition()
									.duration(1000)
									.attr('opacity',1)
									.attr('transform',function(d,i){
										//Angle of container rotation
										var angle = ((360*i)/dataset.length-180);
										return 'rotate('+angle+')';
									});
