const User = require("../models/userModel.js")

// Export users' info in json or xml file (for admin)
const exportUsers = async (req, res) => {
    const format = req.body.format;         // Format parameter (json or xml)
    const selectedUsers = req.body.users;

    if (!selectedUsers || !format) {
        return res.status(400).json({ error: 'Missing users or format' });
    }

    // Filter selected users
    const filteredUsers = await User.find({ _id: { $in: selectedUsers } });

    // Extract to JSON or XML
    if (format === 'json') {
        const exportData = JSON.stringify(filteredUsers, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=users.json');
        return res.send(exportData);
    } else if (format === 'xml') {
        const convertToStringIds = (arr) => arr.map(id => id.toString());

        // Prepare our data for XML
        const xmlData = filteredUsers.map(user => ({
            _id: user._id.toString(),
            name: user.name,
            surname: user.surname,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            password: user.password,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture,
            placeOfResidence: user.placeOfResidence,
            workingPosition: user.workingPosition,
            employmentOrganization: user.employmentOrganization,
            professionalExperience: user.professionalExperience.length > 0 
                ? { experience: user.professionalExperience }
                : { professionalExperience: [] },
            education: user.education.length > 0 
                ? { education: user.education }
                : { education: [] },
            skills: user.skills.length > 0 
                ? { skill: user.skills }
                : { skills: [] },
            recentConversations: user.recentConversations.length > 0 
                ? { conversation: convertToStringIds(user.recentConversations) }
                : { recentConversations: [] },
            network: user.network.length > 0 
                ? { connection: convertToStringIds(user.network) }
                : { network: [] },
            publishedPosts: user.publishedPosts.length > 0 
                ? { post: convertToStringIds(user.publishedPosts) }
                : { publishedPosts: [] },
            publishedJobListings: user.publishedJobListings.length > 0 
                ? { jobListing: convertToStringIds(user.publishedJobListings) }
                : { publishedJobListings: [] },
            likedPosts: user.likedPosts.length > 0 
                ? { post: convertToStringIds(user.likedPosts) }
                : { likedPosts: [] },
            privateDetails: user.privateDetails.length > 0 
                ? { detail: user.privateDetails }
                : { privateDetails: [] },
            appliedJobs: user.appliedJobs.length > 0 
                ? { job: convertToStringIds(user.appliedJobs) }
                : { appliedJobs: [] },
            postNotifications: user.postNotifications.length > 0 
                ? { notification: convertToStringIds(user.postNotifications) }
                : { postNotifications: [] },
            linkUpRequests: user.linkUpRequests.length > 0 
                ? { request: convertToStringIds(user.linkUpRequests) }
                : { linkUpRequests: [] },
            publishedComments: user.publishedComments.length > 0 
                ? { comment: convertToStringIds(user.publishedComments) }
                : { publishedComments: [] }
        }));

        const exportData = js2xmlparser.parse('users', { user: xmlData });
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xml');
        return res.send(exportData);
    } else {
        return res.status(400).json({ error: 'Unsupported format' });
    }
};

module.exports = {
    exportUsers
}