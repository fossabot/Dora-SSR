







local Struct = require("Utils").Struct
local DB = require("DB")
local thread = require("thread")






return function(schema, ...)
	schema = schema or ""
	local Config = 
	schema == "" and
	Struct.Config(...) or
	Struct[schema].Config(...)
	local tableName = schema == "" and "Config" or schema .. ".Config"
	local conf = Config()
	local oldValues = {}
	local insertValues = {}
	local updateValues = {}
	local deleteValues = {}
	local loaded = false
	local function notify(event, key, value)
		assert(loaded, "Config should be loaded before updating")
		if event == "Modified" then
			if oldValues[key] == nil then
				insertValues[key] = value
			elseif value == nil then
				deleteValues[#deleteValues + 1] = key
			elseif oldValues[key] ~= value then
				updateValues[key] = value
			end
			oldValues[key] = value
		elseif event == "Updated" then
			local iValues = {}
			for k, v in pairs(insertValues) do
				local num = false
				local str = false
				if type(v) == "number" then
					num = v
				elseif type(v) == "string" then
					str = v
				end
				iValues[#iValues + 1] = { k, num, str }
			end
			insertValues = {}
			local uValues = {}
			for k, v in pairs(updateValues) do
				local num = false
				local str = false
				if type(v) == "number" then
					num = v
				elseif type(v) == "string" then
					str = v
				end
				uValues[#uValues + 1] = { num, str, k }
			end
			updateValues = {}
			local dValues = {}
			for i = 1, #deleteValues do
				dValues[#dValues + 1] = { deleteValues[i] }
			end
			deleteValues = {}
			thread(function()
				if #iValues > 0 then
					DB:insertAsync(tableName, iValues)
				end
				if #uValues > 0 then
					DB:execAsync("update " .. tableName .. " set value_num = ?, value_str = ? where name = ?", uValues)
				end
				if #dValues > 0 then
					DB:execAsync("delete from " .. tableName .. " where name = ?", dValues)
				end
			end)
		end
	end

	if not DB:exist("Config", schema) then
		DB:exec([[
			CREATE TABLE ]] .. tableName .. [[(
				name TEXT(90) NOT NULL, --配置项名称
				value_num REAL(24,6), --配置项数值
				value_str TEXT(255), --配置项文本
				PRIMARY KEY (name)
			); --通用配置表
		]])
	end

	local function initConfig(self, rows)
		local mt = getmetatable(self)
		local fields = {}
		for i = 1, #mt do
			local fieldName = mt[i]
			fields[fieldName] = true
		end
		for i = 1, #rows do
			local key = rows[i][1]
			if fields[key] then
				local value = rows[i][2] or rows[i][3]
				oldValues[key] = value
				self[key] = value
			else
				print("Config key \"" .. key .. "\" is no longer exist")
			end
		end
	end

	rawset(conf, "loadAsync", function(self)
		local rows = DB:queryAsync("select name, value_num, value_str from " .. tableName)
		loaded = true
		initConfig(self, rows)
	end)

	rawset(conf, "load", function(self)
		local rows = DB:query("select name, value_num, value_str from " .. tableName)
		loaded = true
		initConfig(self, rows)
	end)

	rawset(conf, "__notify", notify)

	return conf
end