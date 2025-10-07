-- QUICK FIX: Remove the foreign key constraint that's blocking shelter messages
-- Run this in your MySQL client or command line

USE paws_db;

-- First, find the constraint name
SHOW CREATE TABLE messages;

-- Then drop it (the constraint name is usually 'messages_ibfk_1' or similar)
-- If you see a different name in the output above, use that instead
ALTER TABLE messages DROP FOREIGN KEY messages_ibfk_1;

-- Done! Now shelters can send messages
