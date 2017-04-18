def is_number(str)
	if (/\d+/.match(str) != nil)
		true
	else
		false
	end
end

def create_msg_arr(str)
	str_arr = str.split("\r\n")
	depth = str_arr.shift.to_i
	txt = str_arr.join(' ')

	[depth, txt]
end

def count_lith(lith)
	# p lith
	lith = lith.split(',')
	hash = {}


	# Proccess precentages separated by a colon
	lith.each do |l|
		if l.include?(';')
			l = l.split(';')
			l.each do |i|
				if !hash.has_key?(i)
					hash[i] = 10
				else
					hash[i] += 10
				end
			end
			next
		end

		if !hash.has_key?(l)
			hash[l] = 20
		else
			hash[l] += 20
		end
	end


	symArr = []
	countArr = []
	hash.each do |sym, count|
		symArr << sym
		countArr << count
	end

	[symArr, countArr]

end

def get_lith_by_depth(depth, lith_arr)
	lith_arr.each do |line|
		if (line[0] == depth)
			return line[1]
		end
	end
	"no lith"
end

def insert_missing_depths_to_lith(lith)
	last_lith = ''
	new_lith_arr = []
	new_hash = {}
	lith_hash = {}
	min_depth = lith[0][0]
	max_depth = lith[-1][0]
	num_of_records = ((max_depth - min_depth) / 10) + 1

	depth = min_depth
	num_of_records.times do |i|
		lith_hash[depth] = get_lith_by_depth(depth, lith)
		depth += 10
	end

	lith_hash.reverse_each do |line|
		if (line[1] == 'no lith')
			new_hash[line[0]] = last_lith
			next
		end

		new_hash[line[0]] = line[1]
		last_lith = line[1]
	end

	new_lith_arr = new_hash.to_a.reverse
end

def writeArrayToJSFile(fileToWrite, var_name, data)
	p 'in  writeArrayToJSFile'
	File.open(fileToWrite, 'w') do |file|
		file.write("var #{var_name} = [\n\t")
		file.write(data[0])
		i = 0
		data.each do |line|
			if i > 0
				file.write(",\n\t")
				file.write(line)
			end
			i += 1
		end
			file.write("\n]")
	end
end












