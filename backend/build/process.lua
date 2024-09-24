do
local _ENV = _ENV
package.preload[ "lib.db" ] = function( ... ) local arg = _G.arg;
local dbUtils = require "utils.db"

local db = {}


function db.SeedTickets()
    DB:exec([[
        CREATE TABLE IF NOT EXISTS Tickets (
            userAddr TEXT PRIMARY KEY,
            nbOfTickets INTEGER NOT NULL DEFAULT 3,
            currentTicketId TEXT,
            ticketGeneratedTime INTEGER,
            resetTime INTEGER
        );
    ]])
    Configured = true
end

-- Function to instantiate a new user if they don't already exist
function db.instantiateUser(userAddr)
    -- Check if the user already exists
    local checkStmt = DB:prepare([[
        SELECT COUNT(*) as count FROM Tickets WHERE userAddr = :userAddr;
    ]])

    checkStmt:bind_names({userAddr = userAddr})
    local exists = false
    for row in checkStmt:nrows() do
        exists = (row.count > 0)
    end
    checkStmt:finalize()

    -- If user exists, return a message
    if exists then
        return "User already exists."

        -- If user does not exist, insert a new record
    else
        local insertStmt = DB:prepare([[
            INSERT INTO Tickets (userAddr, nbOfTickets, currentTicketId, ticketGeneratedTime, resetTime)
            VALUES (:userAddr, :nbOfTickets, :currentTicketId, :ticketGeneratedTime, :resetTime);
        ]])

        insertStmt:bind_names({
            userAddr = userAddr,
            nbOfTickets = 3,  -- Default value for new users
            currentTicketId = "new_ticket_id",  -- Placeholder ticket ID
            ticketGeneratedTime = os.time(),  -- Current timestamp for ticket generation
            resetTime = os.time()  -- Initial reset time is set to current time
        })

        insertStmt:step()
        insertStmt:finalize()

        return "User created successfully."
    end
end

--Use a ticket for a given user
function db.useTicket(userAddr, currentTicketId, ticketGeneratedTime)
    local stmt = DB:prepare([[
        UPDATE Tickets
        SET nbOfTickets = nbOfTickets - 1,
            currentTicketId = :currentTicketId,
            ticketGeneratedTime = :ticketGeneratedTime
        WHERE userAddr = :userAddr AND nbOfTickets > 0;
    ]])

    if stmt then
        stmt:bind_names({userAddr = userAddr, currentTicketId = currentTicketId, ticketGeneratedTime = ticketGeneratedTime})
        local _, err = stmt:step()
        stmt:finalize()
        return not err -- Return true if the ticket was used successfully
    else
        error("Failed to prepare statement: " .. DB:errmsg())
    end
end

-- Check if the ticket is older than 3 minutes (180 seconds)
function db.checkTicketDuration(userAddr)
    local stmt = DB:prepare([[
        SELECT ticketGeneratedTime FROM Tickets WHERE userAddr = :userAddr;
    ]])

    if stmt then
        stmt:bind_names({userAddr = userAddr})
        for row in stmt:nrows() do
            local currentTime = os.time()
            local duration = currentTime - row.ticketGeneratedTime
            if duration > 180 then -- If more than 3 minutes have passed
                db.markTicketExpired(userAddr)
            end
        end
        stmt:finalize()
    end
end

-- Mark a ticket as expired by setting its currentTicketId to "over"
function db.markTicketExpired(userAddr)
    local stmt = DB:prepare([[
        UPDATE Tickets
        SET currentTicketId = 'over'
        WHERE userAddr = :userAddr;
    ]])

    if stmt then
        stmt:bind_names({userAddr = userAddr})
        stmt:step()
        stmt:finalize()
    end
end

-- Reset the number of tickets for the user
function db.resetTicketNumber(userAddr)
    local stmt = DB:prepare([[
        UPDATE Tickets
        SET nbOfTickets = 3,
            resetTime = :resetTime
        WHERE userAddr = :userAddr;
    ]])

    if stmt then
        stmt:bind_names({userAddr = userAddr, resetTime = os.time()})
        stmt:step()
        stmt:finalize()
    end
end

-- Get the time remaining before the next reset
function db.getTimeBeforeReset(userAddr)
    local stmt = DB:prepare([[
        SELECT resetTime FROM Tickets WHERE userAddr = :userAddr;
    ]])

    if stmt then
        stmt:bind_names({userAddr = userAddr})
        for row in stmt:nrows() do
            local resetInterval = 24 * 60 * 60 -- 24 hours
            local timeSinceReset = os.time() - row.resetTime
            local timeRemaining = resetInterval - timeSinceReset
            if timeRemaining <= 0 then
                db.resetTicketNumber(userAddr)
                return 0
            else
                return timeRemaining
            end
        end
        stmt:finalize()
    end
end

-- Get the currentTicketId if the ticket is not expired and there are tickets remaining
function db.getTicketId(userAddr)
    local stmt = DB:prepare([[
        SELECT currentTicketId, nbOfTickets
        FROM Tickets
        WHERE userAddr = :userAddr AND currentTicketId != 'over' AND nbOfTickets > 0;
    ]])

    if stmt then
        stmt:bind_names({userAddr = userAddr})
        for row in stmt:nrows() do
            return row.currentTicketId
        end
        stmt:finalize()
    end
    return nil -- Return nil if no valid ticket is found
end

-- Get all ticket information for a user
function db.getTicketsInfo(userAddr)
    local stmt = DB:prepare([[
        SELECT * FROM Tickets WHERE userAddr = :userAddr;
    ]])

    local ticketInfo = {}
    if stmt then
        stmt:bind_names({userAddr = userAddr})
        for row in stmt:nrows() do
            ticketInfo = {
                userAddr = row.userAddr,
                nbOfTickets = row.nbOfTickets,
                currentTicketId = row.currentTicketId,
                ticketGeneratedTime = row.ticketGeneratedTime,
                resetTime = row.resetTime
            }
        end
        stmt:finalize()
    end
    return ticketInfo
end

return db
end
end

do
local _ENV = _ENV
package.preload[ "utils.db" ] = function( ... ) local arg = _G.arg;
local sqlite3 = require('lsqlite3')
local dbUtils = {}

function dbUtils.queryMany(stmt)
    local rows = {}
    -- Check if the statement was prepared successfully
    if stmt then
        for row in stmt:nrows() do
            table.insert(rows, row)
        end
        stmt:finalize()
    else
        error("Err: " .. DB:errmsg())
    end
    return rows
end

function dbUtils.queryOne(stmt)
    return dbUtils.queryMany(stmt)[1]
end

function dbUtils.rawQuery(query)
    local stmt = DB:prepare(query)
    if not stmt then
        error("Err: " .. DB:errmsg())
    end
    return dbUtils.queryMany(stmt)
end

function dbUtils.execute(stmt, statmentHint)
    if stmt then
        stmt:step()
        if stmt:finalize() ~= sqlite3.OK then
            error("Failed to finalize SQL statement" .. (statmentHint or "") .. ": " .. DB:errmsg())
        end
    else
        error("Failed to prepare SQL statement" .. (statmentHint or "") .. ": " .. DB:errmsg())
    end
end

function dbUtils.queryManyWithParams(query, params, hint)
    local stmt = DB:prepare(query)
    if not stmt then
        error("Err" .. (hint or "") .. ": " .. DB:errmsg())
    end
    stmt:bind_names(params)

    return dbUtils.queryMany(stmt)
end

function dbUtils.queryOneWithParams(query, params, hint)
    local res = dbUtils.queryManyWithParams(query, params, hint)
    if #res == 0 then
        return nil
    end
    return res[1]
end

return dbUtils
end
end

local sqlite3 = require('lsqlite3')

local db = require "lib.db"
local json = require "json"

Version       = "0.0.1"
DB            = DB or sqlite3.open_memory()
Configured    = Configured or false

if not Configured then
    db.SeedTickets()
end

-- Call the function to get all ticket information
Handlers.add(
        "getTicketsInfo",
        Handlers.utils.hasMatchingTag("Action", "Tickets-Info"),
        function (msg)
            local ticketsInfo = db.getTicketsInfo(userAddr)
            local response = ticketsInfo and json.encode(ticketsInfo) or "No ticket information available"
            Handlers.utils.reply(response)(msg)
        end
)


-- Call the function to use a ticket
Handlers.add(
        "useTicket",
        Handlers.utils.hasMatchingTag("Action", "Use-Ticket"),
        function (msg)
            local userAddr = msg.From
            local currentTicketId = userAddr -- Example ticket ID based on timestamp
            local ticketGeneratedTime = os.time()
            -- Check if user can use a ticket
            local success = db.useTicket(userAddr, currentTicketId, ticketGeneratedTime)
            local response = success and "Ticket used" or "No tickets remaining"
            Handlers.utils.reply(response)(msg)
        end
)


-- Call the function to reset the ticket number
Handlers.add(
        "resetTicketNumber",
        Handlers.utils.hasMatchingTag("Action", "Reset-Tickets"),
        function (msg)
            local userAddr = msg.From
            -- Reset ticket number for the user
            db.resetTicketNumber(userAddr)
            print("Ticket count reset to 3")
        end
)


-- Call the function to get time before ticket reset
Handlers.add(
        "getTimeBeforeReset",
        Handlers.utils.hasMatchingTag("Action", "Time-Before-Reset"),
        function (msg)
            local userAddr = msg.From
            -- Get time before next reset
            local timeRemaining = db.getTimeBeforeReset(userAddr)
            local response = tostring(timeRemaining) .. " seconds remaining before reset"
            Handlers.utils.reply(response)(msg)
        end
)



-- Call the function to get the current ticket ID
Handlers.add(
        "getTicketId",
        Handlers.utils.hasMatchingTag("Action", "Get-Ticket-Id"),
        function (msg)
            local userAddr = msg.From
            -- Get the current valid ticket ID for the user
            local ticketId = db.getTicketId(userAddr)
            local response =  ticketId or "No valid ticket available"
            print(response)
            Handlers.utils.reply(response)(msg)
        end
)


-- Call the function to instantiateUser INSERT user in Ticket table if it does not exist
Handlers.add(
        "instantiateUser",
        Handlers.utils.hasMatchingTag("Action", "Instantiate-User"),
        function (msg)
            local userAddr = msg.From
            -- Call the database method to instantiate the user
            local result = db.instantiateUser(userAddr)
            Handlers.utils.reply(result)(msg)
        end
)


-- Call the function to instantiateUser INSERT user in Ticket table if it does not exist
Handlers.add(
        "checkHealth",
        Handlers.utils.hasMatchingTag("Action", "Check-Health"),
        function (msg)
            Handlers.utils.reply("Hello, I am alive!.")(msg)
        end
)
return "Loaded Ticket Protocol"