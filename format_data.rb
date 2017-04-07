rows = []
rows_10 = []
count = 0

File.foreach("log/depth.txt") do |line|
	row = line.split(" ")
	i = 0
	new_row = []
	while i < 10
		new_row << row.shift.to_f
		i += 1
	end

	rows << new_row

	# create an array of every tenth record
	if (count%10 == 0 )
		rows_10 << new_row
	end

	count += 1
end

File.open("data/depth_data.txt", 'w') do |file|
	file.write("var depth_data = #{rows}")
end

File.open("data/depth_data_summary.txt", 'w') do |file|
	file.write("var depth_data_summary = #{rows_10}")
end








