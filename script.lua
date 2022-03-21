-- Check is already executed
if getgenv().yumz39dR8w3gPKPc then
    return
end
getgenv().yumz39dR8w3gPKPc = true
repeat wait()
until game:IsLoaded()
and game.Players and game.Players.LocalPlayer
and game.Players.LocalPlayer.Character
getgenv().gameloaded = true

local plr = game.Players.LocalPlayer

-- Anti AFK
local vtu = game:GetService("VirtualUser")
game.Players.LocalPlayer.Idled:Connect(function()
    vtu:CaptureController()
    vtu:ClickButton2(Vector2.new())
end)
-- Format numbers
function formatNumber(v)
	return tostring(v):reverse():gsub("%d%d%d", "%1,"):reverse():gsub("^,", "")
end

local BloxFruits = {
    2753915549, -- Sea 1
    4442272183, -- Sea 2
    7449423635  -- Sea 3
}

if table.find(BloxFruits, game.PlaceId) then
    -- Check is game loaded
    repeat wait()
    until plr:FindFirstChild("DataLoaded")
    and plr:FindFirstChild("Backpack")
    if not plr.PlayerGui:FindFirstChild("Main") then
        repeat wait()
        until plr.PlayerGui:FindFirstChild("Main")
        and plr.PlayerGui:FindFirstChild("ChooseTeam")
        and plr.PlayerGui.ChooseTeam.Visible == true
        and plr.PlayerGui.ChooseTeam.Container.Pirates.Frame.ViewportFrame.TextButton
        wait(5)
    end
    -- Choose Pirates team
    repeat wait()
        pcall(function()
            if plr.PlayerGui.Main.ChooseTeam.Visible == true then
                local Team = plr.PlayerGui.Main.ChooseTeam.Container.Pirates.Frame.ViewportFrame.TextButton
                Team.AnchorPoint = Vector2.new(.5, .5)
                Team.Size = UDim2.new(1, 10000, 1, 1000)
                Team.Transparency = 1
                wait(.2)
                -- Auto Click cua rua
                game:GetService("VirtualUser"):ClickButton1(Vector2.new(50, 50))
                -- Auto Click cua $
                local VS = Workspace.Camera.ViewportSize
                game.VirtualInputManager:SendMouseButtonEvent(VS.X / 2, VS.Y / 2, 0, not game.UserInputService:IsMouseButtonPressed(Enum.UserInputType.MouseButton1), game, 0)
            end
        end)
    until not plr.PlayerGui.Main:WaitForChild("ChooseTeam").Visible
    
    local website = 'https://thuan-cac.herokuapp.com/'

    function Update()
    local StoredDFs = {}
    for i, v in pairs(game.ReplicatedStorage.Remotes.CommF_:InvokeServer("getInventoryFruits")) do
        local FruitName
        if string.find(v.Name, ": ") then
            FruitName = string.split(v.Name, ": ")[2]
        else
            FruitName = string.split(v.Name, "-")[1]
        end
        if i == #game.ReplicatedStorage.Remotes.CommF_:InvokeServer("getInventoryFruits") then
            table.insert(StoredDFs, " " .. FruitName .. ".")
        else
            table.insert(StoredDFs, " " .. FruitName)
        end
    end
    local StoredItems = {}
    for i, v in pairs(game.ReplicatedStorage.Remotes.CommF_:InvokeServer("getInventoryWeapons")) do
        if i == #game.ReplicatedStorage.Remotes.CommF_:InvokeServer("getInventoryWeapons") then
            table.insert(StoredItems, " " .. v.Name .. ".")
        else
            table.insert(StoredItems, " " .. v.Name)
        end
    end
    local UpdateStats = syn.request({
        Url = website.."update",
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"
        },
        Body = game:GetService("HttpService"):JSONEncode({
            ingame = plr.Name,
            idgame = plr.UserId,
            namegame = game:GetService("MarketplaceService"):GetProductInfo(game.PlaceId).Name,
            Level = formatNumber(plr.Data.Level.Value),
            Beli = formatNumber(plr.Data.Beli.Value),
            Fragment = formatNumber(plr.Data.Fragments.Value),
            KhhoDevilFruit = StoredDFs,
            KhhoWeapon = StoredItems
        })
    }).Body
    end
    while true do pcall(function() Update() end) wait(15) end
end
