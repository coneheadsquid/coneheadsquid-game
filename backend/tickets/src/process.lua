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
            local userAddr= msg.Tags.Recipient
            local response = userAddr
            local timestamp = msg.Timestamp

            -- Allow nil timestamps
            db.instantiateUser(userAddr,timestamp)
            response = "instantiateUser done"
            local ticketsInfo = db.getTicketsInfo(userAddr)
            response = ticketsInfo and json.encode(ticketsInfo) or "No ticket information available"

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
            local ticketGeneratedTime =  msg.Timestamp
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
            local tickettime =  msg.Timestamp
            -- Get time before next reset
            local timeRemaining = db.getTimeBeforeReset(userAddr,tickettime)
            local response = tostring(timeRemaining)
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
            local tsp =  msg.Timestamp
            -- Call the database method to instantiate the user
            local result = db.instantiateUser(userAddr,tsp)
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