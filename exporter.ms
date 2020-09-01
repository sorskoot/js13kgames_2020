fn round2 x = (floor((100*x)+0.5)/100)

out_name = ((GetDir #export)+"/level.txt")
out_file = createfile out_name

-- ** TARGETS **--
format "targets:[\n" to:out_file
for i in objects do 
(		
	objname = i.name
	if(matchPattern objname pattern:"Target*") then
	(	format "[\n" to:out_file
		for k = 1 to (numKnots i ) do
		(
			vert =  (getKnotPoint i 1 k)  
			 format "[%,%,%]," (round2 vert.x) (round2 vert.z) (round2 vert.y)  to:out_file
		)
		format "],\n" to:out_file
	)
	
)
format "\n],\n" to:out_file

-- ** PLACEHOLDERS **--
format "placeholders:[\n" to:out_file
for i in objects do 
(		
	if(matchPattern i.name pattern:"Placeholder*") then
	(
	
		vert =  (i.pos)  
		format "[%,%,%]," (vert.x as integer) (vert.z as integer) (vert.y as integer)  to:out_file		
	)
)
format "\n],\n" to:out_file

-- ** BLOCKS **--
format "box:[\n" to:out_file
for i in objects do 
(		
	if(matchPattern i.name pattern:"Box*") then
	(
	
		lookup = getUserProp i "lookup"		
		if (lookup == undefined ) then 
			lookup = 7
			
		format "[[%,%,%], %, %]," (round2 i.pos.x) (round2 i.pos.z) (round2 i.pos.y) (round2 i.length) lookup to:out_file				
		
	)
)
format "\n],\n" to:out_file

for i in objects do 
(		
	if(matchPattern i.name pattern:"END") then
	(
		format "end:[%,%,%],\n" (i.pos.x as integer) (i.pos.z as integer) (i.pos.y as integer) to:out_file
	)
)
		
		

close out_file