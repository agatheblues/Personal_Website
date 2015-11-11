# d3 small multiples positioned on a circle
Again, playing around with d3!

## Timeline
A simple timeline, dotted with main dots on years. Easily turnable horizontal/Vertical. 
It's built as an axis, so you can add relevant datas to the years and expand it!

## Small multiple - Vertical bar charts
Multiple vertical bar charts, vertically distributed. Parameters you might want to adjust : 
- barHeight : height of the bars. It's fixed for design purposes.
- paddingSection : will impact space in between bars and in between section
- paddingLeft : position of the labels on the left
- betweenSection : gap between sections

Sections are positioned depending on the cumulated height of previous sections. That way, they are all separated by the same distance, whatever the number of skills in the bar chart. 

Note : xScale and colorScale are built assuming the grades go from 0 to 100 max. 
