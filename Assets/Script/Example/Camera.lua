-- [yue]: Script/Example/Camera.yue
local Node = dora.Node -- 1
local Model = dora.Model -- 1
local Sprite = dora.Sprite -- 1
local Vec2 = dora.Vec2 -- 1
local once = dora.once -- 1
local Director = dora.Director -- 1
local cycle = dora.cycle -- 1
local Ease = dora.Ease -- 1
local threadLoop = dora.threadLoop -- 1
local App = dora.App -- 1
local ImGui = dora.ImGui -- 1
do -- 3
	local _with_0 = Node() -- 3
	_with_0:addChild((function() -- 4
		local _with_1 = Model("Model/xiaoli.model") -- 4
		_with_1.look = "happy" -- 5
		_with_1:play("idle", true) -- 6
		return _with_1 -- 4
	end)()) -- 4
	_with_0:addChild((function() -- 8
		local _with_1 = Sprite("Image/logo.png") -- 8
		_with_1.scaleX = 0.4 -- 9
		_with_1.scaleY = 0.4 -- 10
		_with_1.position = Vec2(200, -100) -- 11
		_with_1.angleY = 45 -- 12
		_with_1.z = -300 -- 13
		return _with_1 -- 8
	end)()) -- 8
	_with_0:schedule(once(function() -- 15
		local _with_1 = Director.currentCamera -- 15
		cycle(1.5, function(dt) -- 16
			_with_1.position = Vec2(200 * Ease:func(Ease.InOutQuad, dt), 0) -- 16
		end) -- 16
		cycle(0.1, function(dt) -- 17
			_with_1.rotation = 25 * Ease:func(Ease.OutSine, dt) -- 17
		end) -- 17
		cycle(0.2, function(dt) -- 18
			_with_1.rotation = 25 - 50 * Ease:func(Ease.InOutQuad, dt) -- 18
		end) -- 18
		cycle(0.1, function(dt) -- 19
			_with_1.rotation = -25 + 25 * Ease:func(Ease.OutSine, dt) -- 19
		end) -- 19
		cycle(1.5, function(dt) -- 20
			_with_1.position = Vec2(200 * Ease:func(Ease.InOutQuad, 1 - dt), 0) -- 20
		end) -- 20
		local zoom = _with_1.zoom -- 21
		cycle(2.5, function(dt) -- 22
			_with_1.zoom = zoom + Ease:func(Ease.InOutQuad, dt) -- 22
		end) -- 22
		return _with_1 -- 15
	end)) -- 15
end -- 3
local windowFlags = { -- 27
	"NoDecoration", -- 27
	"AlwaysAutoResize", -- 28
	"NoSavedSettings", -- 29
	"NoFocusOnAppearing", -- 30
	"NoNav", -- 31
	"NoMove" -- 32
} -- 26
return threadLoop(function() -- 33
	local width -- 34
	width = App.visualSize.width -- 34
	ImGui.SetNextWindowPos(Vec2(width - 10, 10), "Always", Vec2(1, 0)) -- 35
	ImGui.SetNextWindowSize(Vec2(240, 0), "FirstUseEver") -- 36
	return ImGui.Begin("Camera", windowFlags, function() -- 37
		ImGui.Text("Camera (Yuescript)") -- 38
		ImGui.Separator() -- 39
		return ImGui.TextWrapped("View camera motions, use 3D camera as default!") -- 40
	end) -- 40
end) -- 40
