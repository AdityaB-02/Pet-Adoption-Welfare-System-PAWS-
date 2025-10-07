-- Add is_shelter column to messages table
-- This column indicates whether the sender is a shelter (1) or a user (0)

ALTER TABLE messages 
ADD COLUMN is_shelter TINYINT(1) DEFAULT 0 NOT NULL AFTER sender_id;

-- Update existing messages to set is_shelter based on whether sender_id exists in shelters table
UPDATE messages m
SET is_shelter = 1
WHERE EXISTS (
    SELECT 1 FROM shelters s WHERE s.shelter_id = m.sender_id
);

-- The column will now be:
-- is_shelter = 1 (TRUE) if sender is a shelter
-- is_shelter = 0 (FALSE) if sender is a user
