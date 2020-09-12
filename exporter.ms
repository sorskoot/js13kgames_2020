	fn toInt x = (
		if x < 0 then (
				x = x-.5
			)else (
			   x = x +.5
			)
		 x as integer
		)

	out_name = "C:/dev/js13kgames_2020/src/components/level.js" --((GetDir #export)+"/level01.js")	
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
				 format "[%,%,%]," (toInt vert.x) (toInt  vert.z) -(toInt vert.y)  to:out_file
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
		
			rot = 0
			if(i.rotation.x_rotation != 0) then
				rot = 1 
					
			if(i.rotation.y_rotation != 0) then
				rot = 2			
			
			format "[%,%,%, %]," (toInt i.pos.x) (toInt i.pos.z) -(toInt i.pos.y) rot  to:out_file		
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
				
			format "[[%,%,%], %, %]," (toInt i.pos.x) (toInt i.pos.z) -(toInt i.pos.y) (toInt i.length) lookup to:out_file				
			
		)
	)
	format "\n],\n" to:out_file

	for i in objects do 
	(		
		if(matchPattern i.name pattern:"END") then
		(
			format "end:[%,%,%],\n" (toInt i.pos.x) (toInt i.pos.z) -(toInt i.pos.y) to:out_file
		)
	)

	format " }" to:out_file
			
			

	close out_file