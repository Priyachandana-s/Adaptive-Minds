const {
    isTopicRelevant,
    isShortVideo,
    isEnglishVideo
} = require("./videoFilterService");

// ============================================================
// DIFFICULTY MAPPING
// ============================================================

const difficultyMap = {
    Easy: "Beginner",
    Medium: "Intermediate",
    Hard: "Advanced"
};

// ============================================================
// GET LEARNING LEVEL
// ============================================================

function getLearningLevel(difficulty) {
    return difficultyMap[difficulty];
}

// ============================================================
// BUILD YOUTUBE SEARCH QUERY
// ============================================================

function buildSearchQuery(subject, topic, difficulty) {
    const learningLevel =
        getLearningLevel(difficulty);

    if (!learningLevel) {
        throw new Error(
            "Invalid difficulty level"
        );
    }

    const subjectTopicMap = {
        "operating systems": {
            "os": "Operating Systems"
        },

        "computer networks": {
            "cn": "Computer Networks"
        },

        "data structures": {
            "ds": "Data Structures"
        },

        "database management system": {
            "dbms": "Database Management Systems"
        },

        "object oriented programming": {
            "oop": "Object Oriented Programming"
        },

        "artificial intelligence": {
            "ai": "Artificial Intelligence"
        },

        "machine learning": {
            "ml": "Machine Learning"
        }
    };

    const subjectKey =
        subject.toLowerCase().trim();

    const topicKey =
        topic.toLowerCase().trim();

    const mappedTopic =
        subjectTopicMap[subjectKey]?.[topicKey];

    const finalTopic =
        mappedTopic || topic;

    return `${subject} ${finalTopic} ${learningLevel} tutorial`;
}

// ============================================================
// FILTER YOUTUBE RECOMMENDATIONS
// ============================================================

function filterRecommendations(
    videos,
    subject,
    topic,
    difficulty
) {
    const learningLevel =
        getLearningLevel(difficulty);

    if (!learningLevel) {
        throw new Error(
            "Invalid difficulty level"
        );
    }

    const filteredVideos =
        videos.filter((video) => {

            if (
                !isTopicRelevant(
                    video,
                    topic
                )
            ) {
                return false;
            }

            if (
                !isEnglishVideo(video)
            ) {
                return false;
            }

            if (
                isShortVideo(video)
            ) {
                return false;
            }

            return true;
        });

    return filteredVideos;
}

// ============================================================
// EXPORT
// ============================================================

async function getRecommendations(
    subject,
    topic,
    difficulty
) {
    const { searchYouTube } =
        require("./youtubeService");

    const { rankVideos } =
        require("./rankingService");

    const query =
        buildSearchQuery(
            subject,
            topic,
            difficulty
        );

    const videos =
        await searchYouTube(query);

    const filteredVideos =
        filterRecommendations(
            videos,
            subject,
            topic,
            difficulty
        );

    const rankedVideos =
        rankVideos(
            filteredVideos,
            subject,
            topic,
            difficulty
        );

    return {
        subject,
        topic,
        difficulty,
        searchQuery: query,
        totalVideosFound: videos.length,
        totalVideosAfterFiltering:
            filteredVideos.length,
        recommendations: rankedVideos
    };
}

module.exports = {
    getLearningLevel,
    buildSearchQuery,
    filterRecommendations,
    getRecommendations
};