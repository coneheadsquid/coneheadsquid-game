local dbUtils = require "utils.db"

local db = {}

-- Function to create the Messages table if it doesn't exist
function db.createMessagesTable()
    DB:exec([[
        CREATE TABLE IF NOT EXISTS Messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userid TEXT NOT NULL,
            name TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        );
    ]])
end

-- Function to add a new message
function db.sendMessage(userid, name, message,timestamp)
    DB:exec("INSERT INTO Messages (userid, name, message, timestamp) VALUES (:userid, :name, :message, :timestamp);", {
        userid = userid,
        name = name,
        message = message,
        timestamp = timestamp
    })

    -- Keep only the last 500 messages
    DB:exec([[
        DELETE FROM Messages WHERE id NOT IN (
            SELECT id FROM Messages ORDER BY timestamp DESC LIMIT 500
        );
    ]])
end

-- Function to retrieve the last 'n' messages
function db.getLastMessages(n)
    local stmt = DB:prepare([[
        SELECT id, userid, name, message, timestamp FROM Messages
        ORDER BY timestamp DESC LIMIT :n
    ]])

    stmt:bind_names({n = n})
    local messages = {}
    for row in stmt:nrows() do
        table.insert(messages, {
            id = row.id,
            userid = row.userid,
            name = row.name,
            message = row.message,
            timestamp = row.timestamp
        })
    end
    stmt:finalize()

    return messages
end

return db
