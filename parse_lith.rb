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

data = insert_missing_depths_to_lith(new_data)

writeArrayToJSFile("data/lith.js", "lith", data)







