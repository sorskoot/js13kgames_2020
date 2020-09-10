macroScript Macro2
	category:"DragAndDrop"
	toolTip:""
(
	out_name = "C:/dev/js13kgames_2020/src/components/level01.js" --((GetDir #export)+"/level01.js")
	out_file = createfile out_name

	format "var level = {\n" to:out_file
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
				 format "[%,%,%]," vert.x vert.z -vert.y  to:out_file
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
			format "[%,%,%]," vert.x vert.z -vert.y  to:out_file		
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
				
			format "[[%,%,%], %, %]," i.pos.x i.pos.z -i.pos.y i.length lookup to:out_file				
			
		)
	)
	format "\n],\n" to:out_file

	for i in objects do 
	(		
		if(matchPattern i.name pattern:"END") then
		(
			format "end:[%,%,%],\n" (i.pos.x as integer) (i.pos.z as integer) -(i.pos.y as integer) to:out_file
		)
	)

	format " }" to:out_file
			
			

	close out_file
)
