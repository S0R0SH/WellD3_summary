rows = []
File.foreach("data/dummy_data.txt") do |line|
	row = line.split(" ")
	i = 0
	new_row = []
	while i < 6
		new_row << row.shift.to_f
		i += 1
	end
	rows << new_row
end

File.open("data/new_depth_data.txt", 'w') do |file|
	file.write("var depth_data = #{rows}")
end








