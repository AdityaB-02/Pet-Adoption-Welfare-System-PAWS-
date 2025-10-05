const db = require('../config/db'); // Your database connection

/**
 * @desc    Get application statistics (shelter count, pet count)
 * @route   GET /api/app/stats
 * @access  Public
 */
const getStats = async (req, res) => {
    try {
        // Query to get the count of shelters
        const [shelterRows] = await db.query('SELECT COUNT(*) as shelterCount FROM shelters');
        const shelterCount = shelterRows[0].shelterCount;

        // Query to get the count of pets available for adoption
        const [petRows] = await db.query("SELECT COUNT(*) as petCount FROM pets WHERE adoption_status = 'Available'");
        const petCount = petRows[0].petCount;
        
        res.status(200).json({
            shelterCount,
            petCount
        });

    } catch (error) {
        console.error('Error fetching application stats:', error);
        res.status(500).json({ message: 'Server error while fetching stats.' });
    }
};

module.exports = {
    getStats,
};