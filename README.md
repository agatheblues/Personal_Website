# d3-catbug
Again, playing around with d3.

## Timeline
A simple timeline, dotted with main dots on years. Easily turnable horizontal/Vertical. 
It's built as an axis, so you can add relevant datas to the years and expand it!

## Small multiple - Vertical bar charts
Multiple vertical bar charts, vertically distributed. Parameters you might want to adjust : 
- barHeight : height of the bars. It's fixed for design purposes.
- paddingSection : will impact space in between bars and in between section
- paddingLeft : position of the labels on the left

Note : xScale and colorScale are built assuming the grades go from 0 to 100 max. 
An improvement would be to remove this constraint and base the scales on the maximum level of the whole dataset.
