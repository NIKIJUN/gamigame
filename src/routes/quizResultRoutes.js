const express = require("express");
const router = express.Router();

const quizResultController = require("../controllers/quizResultController");

router.post("/", quizResultController.submitQuizResult);
router.get("/", quizResultController.getAllQuizResults);
router.get("/student/:studentId", quizResultController.getStudentQuizResults);
router.get(
  "/student/:studentId/recommendation/latest",
  quizResultController.getLatestStudentRecommendation
);

module.exports = router;