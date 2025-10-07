-- Fix the foreign key constraint issue in messages table
-- The sender_id can be either a user_id OR a shelter_id, so we need to remove the foreign key constraint

-- Step 1: Check current constraints
SELECT 
    CONSTRAINT_NAME, 
    TABLE_NAME, 
    COLUMN_NAME, 
    REFERENCED_TABLE_NAME, 
    REFERENCED_COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE 
    TABLE_NAME = 'messages' 
    AND TABLE_SCHEMA = 'paws_db'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Step 2: Drop the foreign key constraint on sender_id
-- Replace 'messages_ibfk_1' with the actual constraint name from Step 1 if different
ALTER TABLE messages DROP FOREIGN KEY messages_ibfk_1;

-- Step 3: Keep the index for performance but remove the constraint
-- The sender_id column will still be indexed but won't enforce foreign key relationship

-- Note: We're removing the constraint because sender_id can reference either:
-- - users.user_id (when is_shelter = 0)
-- - shelters.shelter_id (when is_shelter = 1)
-- MySQL doesn't support conditional foreign keys, so we handle this at the application level
