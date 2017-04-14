require_relative 'helpers'

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

writeArrayToJSFile("data/mudMsg.js", "mudMsg", new_data)












