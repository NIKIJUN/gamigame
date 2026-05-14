const getDecisionTreeRecommendation = ({
  score,
  vocabularyScore = 0,
  grammarScore = 0,
  readingScore = 0,
  speakingScore = 0,
}) => {
  if (score >= 85 && vocabularyScore >= 80 && grammarScore >= 70) {
    return {
      type: "enrichment",
      title: "Materi Pengayaan Direkomendasikan",
      message:
        "Skor kamu sangat baik. Sistem merekomendasikan materi pengayaan Daily Conversation Practice.",
      recommended_material_type: "enrichment",
    };
  }

  if (score >= 85 && speakingScore < 70) {
    return {
      type: "enrichment",
      title: "Pengayaan Speaking Practice",
      message:
        "Pemahaman materi kamu sudah baik. Sistem merekomendasikan latihan speaking agar kemampuan percakapan meningkat.",
      recommended_material_type: "enrichment",
    };
  }

  if (score >= 60 && score < 85) {
    return {
      type: "practice",
      title: "Latihan Tambahan Direkomendasikan",
      message:
        "Skor kamu cukup baik, tetapi masih perlu latihan tambahan pada vocabulary dan grammar.",
      recommended_material_type: "practice",
    };
  }

  if (grammarScore < 60) {
    return {
      type: "remedial",
      title: "Remedial Grammar Direkomendasikan",
      message:
        "Hasil grammar kamu masih perlu ditingkatkan. Sistem merekomendasikan ulang materi Simple Present Tense.",
      recommended_material_type: "remedial",
    };
  }

  if (vocabularyScore < 60) {
    return {
      type: "remedial",
      title: "Remedial Vocabulary Direkomendasikan",
      message:
        "Hasil vocabulary kamu masih perlu ditingkatkan. Sistem merekomendasikan ulang materi Daily Activities Vocabulary.",
      recommended_material_type: "remedial",
    };
  }

  return {
    type: "remedial",
    title: "Ulangi Materi Dasar",
    message:
      "Skor kamu masih perlu ditingkatkan. Sistem merekomendasikan untuk mengulang materi dasar terlebih dahulu.",
    recommended_material_type: "remedial",
  };
};

const calculateSkillScores = (answers) => {
  const skills = {
    vocabulary: { correct: 0, total: 0 },
    grammar: { correct: 0, total: 0 },
    reading: { correct: 0, total: 0 },
    speaking: { correct: 0, total: 0 },
    listening: { correct: 0, total: 0 },
    writing: { correct: 0, total: 0 },
  };

  answers.forEach((answer) => {
    const skill = answer.skill_focus;

    if (!skills[skill]) {
      return;
    }

    skills[skill].total += 1;

    if (answer.is_correct) {
      skills[skill].correct += 1;
    }
  });

  const result = {};

  Object.keys(skills).forEach((skill) => {
    const { correct, total } = skills[skill];

    result[`${skill}Score`] = total > 0 ? Math.round((correct / total) * 100) : 0;
  });

  return result;
};

module.exports = {
  getDecisionTreeRecommendation,
  calculateSkillScores,
};