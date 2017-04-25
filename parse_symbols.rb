require_relative 'helpers'

rock_data = ''
sym = File.open("symbols/chert.sym", "r") do |file|
  rock_data = file.read
end

p rock_data
# data_arr = des_data.split("\r\n\r\n")

# data_out = []

# data_arr.each do |line|
# 	data_out << create_msg_arr(line)
# end

# p new_data

# File.open("data/desMsg.js", 'w') do |file|
# 	file.write("var desMsg = #{data_out}")
# end