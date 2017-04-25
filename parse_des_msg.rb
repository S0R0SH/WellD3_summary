require_relative 'helpers'

des_data = ''
desMsg = File.open("log/desmsg.txt", "r") do |file|
  des_data = file.read.chomp
end

data_arr = des_data.split("\r\n\r\n")

data_out = []

data_arr.each do |line|
	data_out << create_msg_arr(line)
end

# p new_data

File.open("data/desMsg.js", 'w') do |file|
	file.write("var desMsg = #{data_out}")
end












