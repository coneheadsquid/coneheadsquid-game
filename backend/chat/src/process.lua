local sqlite3 = require('lsqlite3')
local db = require "lib.db"
local json = require "json"

Version       = "0.0.1"
DB            = DB or sqlite3.open_memory()
Configured    = Configured or false

if not Configured then
    db.createMessagesTable()  -- Ensure the Messages table is created

end
function ValidateMessage(content)
    if (content == nil) then
        return false
    end
    if (string.len(content) < 1) then
        return false
    end
    if (string.len(content) > 1000) then
        return false
    end
    -- Note: Input sanitization is not performed here, but by the bind function

    return true
end

function ValidateAuthorName(authorName)
    if (authorName == nil) then
        return false
    end
    if (string.len(authorName) < 1) then
        return false
    end
    if (string.len(authorName) > 40) then
        return false
    end

    return true
end

function ValidateTimestamp(testTimestamp)
    if (testTimestamp == nil) then
        -- Allow nil timestamps
        return true
    end
    if (testTimestamp < 0) then
        return false
    end

    return true
end

-- Handler to send a message
Handlers.add(
        "sendMessage",
        Handlers.utils.hasMatchingTag("Action", "Send-Message"),
        function (msg)
            local userAddr = msg.From  -- User identifier
            local name = msg.From     -- User's name
            local message = msg.Data -- The message itself
            local timestamp = msg.Timestamp
            -- Validate AuthorName
            if (not ValidateAuthorName(name)) then
                return print("Invalid Author Name")
            end

            -- Validate Content
            if (not ValidateMessage(message)) then
                return print("Invalid Message")
            end
            db.sendMessage(userAddr, name, message,timestamp)
            Handlers.utils.reply("Message sent successfully")(msg)
        end
)

-- Handler to retrieve the last N messages
Handlers.add(
        "getLastMessages",
        Handlers.utils.hasMatchingTag("Action", "Get-Last-Messages"),
        function (msg)
            local n = tonumber(msg.Tags['N']) or 10  -- Default to 10 if 'n' is not provided
            local messages = db.getLastMessages(n)

            local response = json.encode(messages)
            Handlers.utils.reply(response)(msg)
        end
)

-- Original ticket-related handlers remain unchanged...
