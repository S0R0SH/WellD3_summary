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
