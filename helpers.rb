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
	lith = lith.split(',')
	hash = {}

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

	hash
end
