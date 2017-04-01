data = ''
File.open("log/mudmsg.txt", "r") do |file|
  file.flock(File::LOCK_SH)
  data = file.read.chomp
end

data_arr = data.split("\r\n\r\n")

new_data = []

data_arr.each do |line|
	new_line = line.split("\r\n")
	new_data << new_line
end

File.open("data/msg.txt", 'w') do |file|
	file.write("var mudMsg = #{new_data}")
end










