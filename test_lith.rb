def get_lith_by_depth(depth, lith_arr)
	lith_arr.each do |line|
		if (line[0] == depth)
			return line[1]
		end
	end
	"no lith"
end

lith = [
	[60, "{\"B\":100}"],
	[70, "{\"G\":100}"],
	[80, "{\"G\":80,\"S\":20}"],
	[120, "{\"C\":40,\"S\":10,\"A\":40},\"I\":10"],
	[130, "{\"G\":80,\"S\":20}"],
	[140, "{\"G\":80,\"S\":20}"],
	[150, "{\"C\":10,\"G\":70,\"S\":20}"],
	[160, "{\"G\":100}"],
	[200, "{\"R\":100}"],
	[210, "{\"H\":100}"]
]

def insert_missing_depths_to_lith(lith)
	last_lith = ''
	new_lith_arr = []
	new_lith= []
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

p insert_missing_depths_to_lith(lith)
