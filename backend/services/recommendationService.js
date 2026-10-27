
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

function getLearningLevel(difficulty) {
    return difficultyMap[difficulty] || null;
}

// ============================================================
// BUILD YOUTUBE SEARCH QUERY
// ============================================================

function buildSearchQuery(subject, topic, difficulty) {
    const learningLevel = getLearningLevel(difficulty);

    if (!learningLevel) {
        throw new Error("Invalid difficulty level");
    }

    // Use concise search terms for better YouTube results.
    const subjectTopicMap = {
        "operating systems": {
            os: "Operating Systems"
        },
        "computer networks": {
            cn: "Computer Networks"
        },
        "data structures": {
            ds: "Data Structures"
        },
        "database management systems": {
            dbms: "Database Management Systems"
        },
        "object oriented programming": {
            oop: "Object Oriented Programming"
        },
        "artificial intelligence": {
            ai: "Artificial Intelligence"
        },
        "machine learning": {
            ml: "Machine Learning"
        },
        "biology for computer engineers": {
            "biomimetics: nature-inspired materials and mechanisms":
                "Biomimetics biomimicry nature-inspired engineering",
            "c compilers, c data types and optimization":
                "C compiler data types optimization programming"
        },
        microcontrollers: {
            "c compilers, c data types and optimization":
                "C compiler data types optimization programming"
        },
        "analysis and design of algorithms": {
            "dynamic programming and greedy algorithms":
                "Dynamic Programming Greedy Algorithms",
            "divide and conquer algorithms":
                "Divide and Conquer Algorithms"
        },
        "digital design and computer organization": {
            "boolean algebra and logic gates":
                "Boolean Algebra Digital Logic Gates",
            "combinational logic circuits":
                "Combinational Logic Circuits",
            "sequential logic circuits":
                "Sequential Logic Circuits"
        }
    };

    const subjectKey = subject.toLowerCase().trim();
    const topicKey = topic.toLowerCase().trim();

    const mappedTopic = subjectTopicMap[subjectKey]?.[topicKey];

    const finalTopic = mappedTopic || topic;

    return `${finalTopic} ${learningLevel} tutorial`;
}

// ============================================================
// FLEXIBLE TOPIC MATCHING
// ============================================================

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function hasTopicMatch(video, topic) {
    const title = normalizeText(video.title);
    const description = normalizeText(video.description);
    const requestedTopic = normalizeText(topic);

    if (!title && !description) {
        return false;
    }

    // First use the existing topic relevance filter.
    if (isTopicRelevant(video, topic)) {
        return true;
    }

    // Fallback: allow a meaningful topic match in title/description.
    const words = requestedTopic
        .split(" ")
        .filter((word) => word.length > 2);

    if (words.length === 0) {
        return false;
    }

    const searchableText = `${title} ${description}`;

    const matchingWords = words.filter((word) =>
        searchableText.includes(word)
    );

    // Longer topics contain many words. Requiring every word
    // would reject relevant videos whose titles use synonyms.
    const requiredMatches = Math.min(
        2,
        words.length
    );

    return matchingWords.length >= requiredMatches;
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
    const learningLevel = getLearningLevel(difficulty);

    if (!learningLevel) {
        throw new Error("Invalid difficulty level");
    }

    const filteredVideos = videos.filter((video) => {
        const relevant = hasTopicMatch(video, topic);
        const english = isEnglishVideo(video);
        const isShort = isShortVideo(video);

        // Keep the existing language and duration restrictions.
        return relevant && english && !isShort;
    });

    // If strict filtering rejects every result, return relevant
    // English videos as a fallback, while still excluding Shorts.
    if (filteredVideos.length === 0) {
        return videos.filter((video) => {
            return (
                hasTopicMatch(video, topic) &&
                !isShortVideo(video) &&
                isEnglishVideo(video)
            );
        });
    }

    return filteredVideos;
}

// ============================================================
// GET RECOMMENDATIONS
// ============================================================

async function getRecommendations(
    subject,
    topic,
    difficulty
) {
    const { searchYouTube } = require("./youtubeService");
    const { rankVideos } = require("./rankingService");

    const query = buildSearchQuery(
        subject,
        topic,
        difficulty
    );

    const videos = await searchYouTube(query);

    const filteredVideos = filterRecommendations(
        videos,
        subject,
        topic,
        difficulty
    );

    const rankedVideos = rankVideos(
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
        totalVideosAfterFiltering: filteredVideos.length,
        recommendations: rankedVideos
    };
}

module.exports = {
    getLearningLevel,
    buildSearchQuery,
    filterRecommendations,
    getRecommendations
};
