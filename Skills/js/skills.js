var dataset = [
	{
	 "section": "Cake",
	 "skills": [
	      {"name": "Cookies","level": 10},
	      {"name": "Pies","level": 20},
	      {"name": "Ice Cream","level": 30},
	      {"name": "Pancakes","level": 40}
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
  	 "section": "Drinks",
  	 "skills": [
  	      {"name": "Wine","level": 70},
  	      {"name": "Beer","level": 100},
  	      {"name": "Lemonade","level": 20}
  	  ]
  },
	{
	 "section": "Animals",
	 "skills": [
	      {"name": "Cats","level": 50},
	      {"name": "Dog","level": 40},
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
  }
];

//Width and height
var w = 400;
var h = 500;
var barHeight = 8;
var paddingSection = 5;
var paddingLeft = w/3;
var sectionPosition = 0;
var betweenSection = 20;

var skills = d3.select('#chart')
	            .append('svg')
	            .attr('width',w)
	            .attr('height',h)
					.append('g')
					.attr("id","skills");
					//.attr('transform','translate('+ paddingLeft +',0)');

//Create scale X
var xScale =  d3.scale.linear()
                        .domain([0,100])
                        .range([0,w/2]);

var colorScale=d3.scale.linear()
                    .domain([0,100])
                    .rangeRound([200,100]);

//Create one scale Y function for each section
var yScales = [];
var yAxisDefs = [];

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

//Create containers
var skillContainer = d3.select('#skills').selectAll('g')
											.data(dataset)
											.enter()
											.append('g')
											.each(function(d, i) { d.index = i; }) //Need the index to be accessible from children node later
											.attr('class',function(d){return d.section + ' skillContainer';})
												.append('g')
												.attr('class','bars');


d3.selectAll('g.skillContainer')
					.attr('transform',function(d,i){
						//Position of the next section is the cumulated previous section heights
						var curSectionPosition = sectionPosition;
						sectionPosition += (barHeight + paddingSection)*(d.skills.length) + betweenSection; // previous section position + previous section height + a little bit of space between sections
						return 'translate(0,'+ curSectionPosition +')';})
					//Animation to move axis g.skillContainers to the right
					.transition()
	                .duration(1000)
					.delay(function(d,i){
						return i*100;
					})
					.attr('transform',function(d,i){
						var currentY = d3.transform(d3.select(this).attr("transform")).translate[1]; //Get Y position
						return 'translate('+ paddingLeft +','+ currentY +')';
					});

//Create bars
var skillBars = skillContainer.selectAll('g.bars')
								.data(function(d){return d.skills;})
								.enter()
  								.append('rect')
									.attr("x",0)
				                   	.attr("y", function(d,i) { return yScales[d3.select(this.parentNode).datum().index](d.name); }) //i = index of the skills so 0 1 2 3 0 1 2 3 etc. We need the parent node index to call the same yScale for the whole section.
				                   	.attr("height",barHeight) //function(d,i){ return yScales[d3.select(this.parentNode).datum().index].rangeBand();}
				                   	.attr("width", 0)
									.attr('fill',function(d){return 'rgb(100,'+colorScale(d.level)+','+colorScale(d.level)+')';})
									.transition()
						                .duration(1000)
						                .delay(function(d,i){
						                    return 950+i*100;
						                })
										.attr("width", function(d){return xScale(d.level);});

//Create axis
var yAxis = d3.selectAll('g.skillContainer')
				.append('g')
				.attr("class", "y axis")
				.each(function(d,i){
					return d3.select(this).call(yAxisDefs[i]);
					}
				);
