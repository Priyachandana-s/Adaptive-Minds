import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LearningPage() {
  const navigate = useNavigate();

  // =========================================================
  // CURRENT LEARNING DATA
  // =========================================================

  const subject =
    localStorage.getItem("currentSubject") ||
    "Data Structures";

  const topic =
    localStorage.getItem("currentTopic") ||
    "Arrays";

  const level =
    localStorage.getItem("recommendedLevel") ||
    "Medium";

  const topicId =
    localStorage.getItem("currentTopicId") || topic;

  // =========================================================
  // STATE
  // =========================================================

  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [videoError, setVideoError] = useState("");

  const progressKey =
    `learningProgress_${topicId}`;

  const completedKey =
    `completedVideos_${topicId}`;

  // =========================================================
  // COMPLETED VIDEOS
  // =========================================================

  const [completedVideos, setCompletedVideos] =
    useState(() => {
      const saved =
        localStorage.getItem(completedKey);

      if (!saved) {
        return [];
      }

      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    });

  // =========================================================
  // LOAD RECOMMENDATIONS
  // =========================================================

  useEffect(() => {
    async function loadRecommendations() {
      setLoadingVideos(true);
      setVideoError("");

      try {
        const response = await fetch(
          "http://localhost:5000/api/recommend",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject: subject,
              topic: topic,
              difficulty: level,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load recommendations"
          );
        }

        const data = await response.json();

        console.log(
          "Learning Page Recommendations:",
          data
        );

        const recommendedVideos =
          data.recommendations || [];

        setVideos(
          recommendedVideos.slice(0, 6)
        );
      } catch (error) {
        console.error(
          "Learning Page Recommendation Error:",
          error
        );

        setVideoError(
          "Unable to load recommended learning resources."
        );

        setVideos([]);
      } finally {
        setLoadingVideos(false);
      }
    }

    loadRecommendations();
  }, [subject, topic, level]);

  // =========================================================
  // SAVE COMPLETED VIDEOS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      completedKey,
      JSON.stringify(completedVideos)
    );
  }, [completedVideos, completedKey]);

  // =========================================================
  // PROGRESS
  // =========================================================

  const completedCount =
    completedVideos.length;

  const totalVideos =
    videos.length;

  const progress =
    totalVideos > 0
      ? Math.round(
          (completedCount / totalVideos) * 100
        )
      : 0;

  const allVideosCompleted =
    totalVideos > 0 &&
    completedCount === totalVideos;

  // =========================================================
  // SAVE OLD PROGRESS FORMAT
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      progressKey,
      String(completedCount)
    );
  }, [completedCount, progressKey]);

  // =========================================================
  // MARK COMPLETE
  // =========================================================

  const markVideoComplete = (videoId) => {
    if (completedVideos.includes(videoId)) {
      return;
    }

    setCompletedVideos((previous) => [
      ...previous,
      videoId,
    ]);
  };

  // =========================================================
  // LEVEL MESSAGE
  // =========================================================

  const getLevelMessage = () => {
    if (level === "Hard") {
      return "Your assessment shows strong understanding. The learning path includes challenging resources to deepen your knowledge.";
    }

    if (level === "Easy") {
      return "Your assessment indicates that strengthening the fundamentals will help build a stronger foundation.";
    }

    return "Your assessment indicates that you should continue building your understanding through structured practice.";
  };

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F7F8FF] text-[#172554]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-white/95 backdrop-blur-xl border-b border-[#E8E7F2] sticky top-0 z-30">

        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5B4BDB] to-[#7C6FF2] flex items-center justify-center text-xl shadow-lg shadow-[#5B4BDB]/20">
              🧠
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#172554]">
                Adaptive Minds
              </h1>

              <p className="text-xs text-[#64748B]">
                Personalized Learning
              </p>
            </div>

          </div>


          {/* DASHBOARD BUTTON */}

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="px-4 py-2.5 rounded-xl bg-[#F3F1FF] text-[#5B4BDB] font-semibold text-sm hover:bg-[#E9E6FF] transition"
          >
            ← Dashboard
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10">

        {/* BREADCRUMB */}

        <div className="flex items-center gap-2 text-sm text-[#94A3B8] mb-6">

          <span>
            {subject}
          </span>

          <span>
            /
          </span>

          <span className="text-[#5B4BDB] font-medium">
            {topic}
          </span>

        </div>


        {/* ===================================================
            TITLE AREA
        =================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEEBFF] text-[#5B4BDB] text-xs font-bold mb-4">
              📚 CURRENT LEARNING
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#172554]">
              {topic}
            </h1>

            <p className="text-[#64748B] mt-3 text-lg">
              {subject} • Personalized learning path
            </p>

          </div>


          {/* AI LEVEL */}

          <div className="bg-white border border-[#E7E5F5] rounded-2xl px-6 py-5 shadow-[0_10px_30px_rgba(79,70,229,0.06)]">

            <p className="text-[#7C6FF2] text-xs font-bold tracking-wide">
              AI RECOMMENDED LEVEL
            </p>

            <div className="flex items-center gap-3 mt-2">

              <div className="w-10 h-10 rounded-xl bg-[#EEEBFF] flex items-center justify-center">
                🤖
              </div>

              <p className="text-2xl font-bold text-[#172554]">
                {level}
              </p>

            </div>

          </div>

        </div>


        {/* ===================================================
            PROGRESS CARD
        =================================================== */}

        <div className="bg-white border border-[#E7E5F5] rounded-[28px] p-6 md:p-7 mb-9 shadow-[0_12px_35px_rgba(79,70,229,0.06)]">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">

            <div>

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-[#EEEBFF] flex items-center justify-center">
                  📈
                </div>

                <h2 className="font-bold text-lg">
                  Learning Progress
                </h2>

              </div>

              <p className="text-[#64748B] text-sm mt-2">
                Complete all recommended resources before taking the final test.
              </p>

            </div>

            <div className="text-3xl font-bold text-[#5B4BDB]">
              {progress}%
            </div>

          </div>


          {/* PROGRESS BAR */}

          <div className="w-full bg-[#EEF0F6] h-3 rounded-full overflow-hidden">

            <div
              className="h-3 bg-gradient-to-r from-[#5B4BDB] to-[#8B7CF6] rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>


          <div className="flex justify-between items-center mt-3">

            <p className="text-[#94A3B8] text-sm">
              {completedCount} of {totalVideos} resources completed
            </p>

            {allVideosCompleted && (
              <span className="text-[#059669] text-sm font-semibold">
                ✓ Learning complete
              </span>
            )}

          </div>

        </div>


        {/* ===================================================
            RECOMMENDED LEARNING HEADER
        =================================================== */}

        <div className="flex items-center gap-4 mb-6">

          <div className="w-12 h-12 rounded-2xl bg-[#E8F1FF] flex items-center justify-center text-2xl">
            🎥
          </div>

          <div>

            <h2 className="text-2xl font-bold text-[#172554]">
              Recommended Learning
            </h2>

            <p className="text-[#64748B] text-sm mt-1">
              Personalized videos selected for{" "}
              <strong className="text-[#334155]">
                {topic}
              </strong>
            </p>

          </div>

        </div>


        {/* ===================================================
            LOADING
        =================================================== */}

        {loadingVideos && (

          <div className="bg-white border border-[#E7E5F5] rounded-[28px] p-12 text-center shadow-sm">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EEEBFF] flex items-center justify-center text-3xl mb-5">
              🔎
            </div>

            <h3 className="text-xl font-bold text-[#172554]">
              Finding your learning resources...
            </h3>

            <p className="text-[#64748B] mt-2">
              Matching videos to your {level} learning level.
            </p>

          </div>

        )}


        {/* ===================================================
            ERROR
        =================================================== */}

        {!loadingVideos &&
          videoError && (

            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-6">

              <p className="text-[#B45309] font-semibold">
                ⚠️ Recommendations unavailable
              </p>

              <p className="text-[#64748B] text-sm mt-2">
                {videoError}
              </p>

            </div>

          )}


        {/* ===================================================
            NO VIDEOS
        =================================================== */}

        {!loadingVideos &&
          !videoError &&
          videos.length === 0 && (

            <div className="bg-white border border-[#E7E5F5] rounded-[28px] p-10 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F1F5F9] flex items-center justify-center text-3xl mb-4">
                📚
              </div>

              <h3 className="font-bold text-xl">
                No learning resources found
              </h3>

              <p className="text-[#64748B] mt-2">
                No matching videos were returned for this topic.
              </p>

            </div>

          )}


        {/* ===================================================
            VIDEO CARDS
        =================================================== */}

        {!loadingVideos &&
          videos.length > 0 && (

            <div className="space-y-5">

              {videos.map(
                (video, index) => {

                  const videoId =
                    video.videoId ||
                    video.id;

                  const completed =
                    completedVideos.includes(
                      videoId
                    );

                  const previousCompleted =
                    index === 0 ||
                    completedVideos.includes(
                      videos[index - 1]?.videoId
                    );

                  const locked =
                    !completed &&
                    !previousCompleted;

                  return (

                    <div
                      key={
                        videoId ||
                        index
                      }
                      className={`bg-white rounded-[26px] overflow-hidden border shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition-all ${
                        completed
                          ? "border-[#BBF7D0]"
                          : locked
                          ? "border-[#E8E7F2] opacity-70"
                          : "border-[#C4B5FD] shadow-[0_12px_40px_rgba(91,75,219,0.08)]"
                      }`}
                    >

                      <div className="flex flex-col md:flex-row">

                        {/* =================================================
                            THUMBNAIL
                        ================================================= */}

                        <div className="md:w-[330px] flex-shrink-0 relative bg-[#F1F5F9]">

                          {video.thumbnail ? (

                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-52 md:h-full object-cover"
                            />

                          ) : (

                            <div className="w-full h-52 bg-[#EEF0F6] flex items-center justify-center text-5xl">
                              ▶️
                            </div>

                          )}


                          {/* NUMBER */}

                          <div className="absolute top-3 left-3 bg-[#172554]/85 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                            Lesson {index + 1}
                          </div>


                          {/* COMPLETED */}

                          {completed && (

                            <div className="absolute top-3 right-3 bg-[#10B981] text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
                              ✓ Completed
                            </div>

                          )}


                          {/* LOCK */}

                          {locked && (

                            <div className="absolute inset-0 bg-white/30 flex items-center justify-center">

                              <div className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-xl">
                                🔒
                              </div>

                            </div>

                          )}

                        </div>


                        {/* =================================================
                            VIDEO DETAILS
                        ================================================= */}

                        <div className="p-6 md:p-7 flex-1">

                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                            <div>

                              <p className="text-[#7C6FF2] text-xs font-bold uppercase tracking-wide">
                                Recommended Resource
                              </p>

                              <h3 className="text-xl font-bold leading-7 text-[#172554] mt-2">
                                {video.title}
                              </h3>

                              <p className="text-[#5B4BDB] text-sm font-medium mt-2">
                                {video.channel}
                              </p>

                            </div>


                            {video.classifiedDifficulty && (

                              <span className="flex-shrink-0 bg-[#F3F1FF] border border-[#DDD6FE] text-[#6D5CE7] text-xs px-3 py-1.5 rounded-full font-semibold">
                                {video.classifiedDifficulty}
                              </span>

                            )}

                          </div>


                          {/* SCORE */}

                          {video.score !== undefined && (

                            <p className="text-[#94A3B8] text-xs mt-3">
                              Recommendation score: {video.score}
                            </p>

                          )}


                          {/* DESCRIPTION */}

                          {video.description && (

                            <p className="text-[#64748B] text-sm mt-4 leading-6 line-clamp-3">
                              {video.description}
                            </p>

                          )}


                          {/* ACTIONS */}

                          <div className="flex flex-wrap gap-3 mt-5">

                            {/* WATCH */}

                            {video.url && (

                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-5 py-2.5 rounded-xl font-semibold transition ${
                                  locked
                                    ? "bg-[#F1F5F9] text-[#94A3B8] pointer-events-none"
                                    : "bg-gradient-to-r from-[#5B4BDB] to-[#7C6FF2] text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#5B4BDB]/20"
                                }`}
                              >
                                ▶ Watch Video
                              </a>

                            )}


                            {/* COMPLETE */}

                            {completed ? (

                              <button
                                disabled
                                className="px-5 py-2.5 rounded-xl font-semibold bg-[#ECFDF5] text-[#059669] border border-[#BBF7D0]"
                              >
                                ✓ Completed
                              </button>

                            ) : locked ? (

                              <button
                                disabled
                                className="px-5 py-2.5 rounded-xl font-semibold bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
                              >
                                🔒 Locked
                              </button>

                            ) : (

                              <button
                                onClick={() =>
                                  markVideoComplete(
                                    videoId
                                  )
                                }
                                className="px-5 py-2.5 rounded-xl font-semibold bg-[#EEF0F6] text-[#334155] hover:bg-[#E4E7EF] transition"
                              >
                                Mark Complete
                              </button>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}


        {/* ===================================================
            FINAL TEST
        =================================================== */}

        <div
          className={`mt-9 rounded-[28px] p-7 md:p-8 border ${
            allVideosCompleted
              ? "bg-[#ECFDF5] border-[#BBF7D0]"
              : "bg-white border-[#E7E5F5]"
          }`}
        >

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            <div>

              <div className="flex items-center gap-3">

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                    allVideosCompleted
                      ? "bg-[#D1FAE5]"
                      : "bg-[#F1F5F9]"
                  }`}
                >
                  {allVideosCompleted
                    ? "🎉"
                    : "🔒"}
                </div>

                <div>

                  <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-wide">
                    Next Step
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Final Confirmation Test
                  </h2>

                </div>

              </div>

              <p className="text-[#64748B] mt-4 max-w-2xl">

                {allVideosCompleted
                  ? "You have completed all recommended learning resources. You can now take the final test."
                  : "Complete all recommended learning resources to unlock the final test."}

              </p>

            </div>


            <button
              disabled={!allVideosCompleted}
              onClick={() =>
                navigate("/final-test")
              }
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold transition ${
                allVideosCompleted
                  ? "bg-gradient-to-r from-[#059669] to-[#10B981] text-white hover:-translate-y-0.5 hover:shadow-lg"
                  : "bg-[#EEF0F6] text-[#94A3B8] cursor-not-allowed"
              }`}
            >
              {allVideosCompleted
                ? "Take Final Test →"
                : "🔒 Locked"}
            </button>

          </div>

        </div>


        {/* ===================================================
            AI EXPLANATION
        =================================================== */}

        <div className="mt-7 bg-[#F3F1FF] border border-[#DDD6FE] rounded-[24px] p-6">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm flex-shrink-0">
              🤖
            </div>

            <div>

              <h3 className="font-bold text-[#5B4BDB]">
                Why this learning path?
              </h3>

              <p className="text-[#64748B] text-sm mt-2 leading-6">
                {getLevelMessage()}
              </p>

            </div>

          </div>

        </div>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-[#E5E7EF] mt-8">

        <div className="max-w-6xl mx-auto px-6 md:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2">

          <p className="text-[#94A3B8] text-sm">
            Adaptive Minds
          </p>

          <p className="text-[#CBD5E1] text-sm">
            Learn • Practice • Improve
          </p>

        </div>

      </footer>

    </div>
  );
}

export default LearningPage;