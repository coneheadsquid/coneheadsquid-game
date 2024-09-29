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
function db.instantiateUser(userAddr,timestamp)
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
            ticketGeneratedTime = timestamp,  -- Current timestamp for ticket generation
            resetTime = timestamp  -- Initial reset time is set to current time
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
function db.getTimeBeforeReset(userAddr,  timestamp)
    local stmt = DB:prepare([[
        SELECT resetTime FROM Tickets WHERE userAddr = :userAddr;
    ]])

    if stmt then
        stmt:bind_names({userAddr = userAddr})
        for row in stmt:nrows() do
            local resetInterval = 24 * 60 * 60 -- 24 hours
            local timeSinceReset = timestamp - row.resetTime
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