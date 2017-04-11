require 'json/ext'
require_relative 'helpers'


lith_data = ''
lith = File.open("log/lith.txt", "r") do |file|
  lith_data = file.read.chomp
end

lith_arr = lith_data.split("\r\n")

new_data = []

i = 0
lith_arr.each do |lith|
	if i > 2
		lith = lith.split(' ')
		lith[0] = lith[0].to_i
		lith[1] = count_lith(lith[1]).to_json
		new_data << lith
	end
	i += 1
end



# data_arr.each do |line|
# 	new_line = line.split("\r\n")
# 	new_data << new_line
# end

File.open("data/lith.js", 'w') do |file|
	file.write("var lith = #{new_data}")
end






