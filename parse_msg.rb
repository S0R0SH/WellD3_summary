mud_data = ''
mudMsg = File.open("log/mudmsg.txt", "r") do |file|
  mud_data = file.read.chomp
end

data_arr = mud_data.split("\r\n\r\n")

new_data = []

data_arr.each do |line|
	new_line = line.split("\r\n")
	new_data << new_line
end

File.open("data/mudMsg.js", 'w') do |file|
	file.write("var mudMsg = #{new_data}")
end











