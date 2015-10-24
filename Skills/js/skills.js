var dataset = [
	{
	 "section": "Web",
	 "skills": [
	      {"name": "HTML","level": 10},
	      {"name": "CSS","level": 20},
	      {"name": "JS","level": 30},
	      {"name": "d3.js","level": 40}
	  ]
  },
	{
	 "section": "Adobe",
	 "skills": [
	      {"name": "Photoshop","level": 50},
	      {"name": "Premiere Pro","level": 60},
	      {"name": "After Effects","level": 70},
	      {"name": "In Design","level": 80}
	  ]
  },
	{
	 "section": "Office",
	 "skills": [
	      {"name": "Word","level": 90},
	      {"name": "Access","level": 100},
	      {"name": "Excel","level": 30},
	      {"name": "PowerPoint","level": 10}
	  ]
	},
  	{
  	 "section": "Atlassian",
  	 "skills": [
  	      {"name": "Jira","level": 70},
  	      {"name": "Confluence","level": 100},
  	      {"name": "Sourcetree","level": 20}
  	  ]
  },
	{
	 "section": "Various",
	 "skills": [
	      {"name": "VBA","level": 50},
	      {"name": "Selenium Webdriver","level": 50}
	  ]
	},
  {
   "section": "Test",
   "skills": [
		{"name": "Chocopepite","level": 80},
		{"name": "Fraise","level": 50},
		{"name": "Comme","level": 80},
		{"name": "Tu veux","level": 50},
		{"name": "Bloup","level": 20}
	]
  }
];

//Width and height
var w = 400;
var h = 600;
var barHeight = 8;
var paddingSection = 20;
var paddingLeft = w/3;

var skills = d3.select('#chart')
	            .append('svg')
	            .attr('width',w)
	            .attr('height',h)
					.append('g')
					.attr("id","skills")
					.attr('transform','translate('+ paddingLeft +',0)');

//Create scale X
var xScale =  d3.scale.linear()
                        .domain([0,100])
                        .range([0,w/2]);

//Create one scale Y function for each section
var yScales = [];
var yAxisDefs = [];

dataset.forEach(function(item){
		//Grab all the skill names for one section
		var domain = [];
		item.skills.forEach(function(skill){
			domain.push(skill.name);
		});

		//var sectionHeight = barHeight*(item.skills.length) + paddingSection;

		//Create scale per section
        var yScale =  d3.scale.ordinal()
		                        .domain(domain)
		                        .rangeBands([0,barHeight*(item.skills.length)], 0.4,0.2); //barHeight*(item.skills.length)

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
											.attr('transform',function(d,i){return 'translate(0,'+ i*h/dataset.length +')';})
												.append('g')
												.attr('class','bars');

//Create bars
var skillBars = skillContainer.selectAll('g.bars')
								.data(function(d){return d.skills;})
								.enter()
  								.append('rect')
									.attr("x",0)
				                   	.attr("y", function(d,i) { return yScales[d3.select(this.parentNode).datum().index](d.name); }) //i = index of the skills so 0 1 2 3 0 1 2 3 etc. We need the parent node index to call the same yScale for the whole section.
				                   	.attr("height",function(d,i){ return yScales[d3.select(this.parentNode).datum().index].rangeBand();})
				                   	.attr("width", function(d){return xScale(d.level);});

//Create axis
var yAxis = d3.selectAll('g.skillContainer')
				.append('g')
				.attr("class", "y axis")
				.each(function(d,i){
					return d3.select(this).call(yAxisDefs[i]);
					}
				);
