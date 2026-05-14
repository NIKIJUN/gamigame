const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("../config/database");
const Material = require("../models/Material");
const Quiz = require("../models/Quiz");

dotenv.config();

const seedEnglishData = async () => {
  try {
    await connectDB();

    console.log("Menghapus data lama...");

    await Material.deleteMany({});
    await Quiz.deleteMany({});

    console.log("Membuat materi English...");

    const vocabularyMaterial = await Material.create({
      title: "Vocabulary: Daily Activities",
      slug: "vocabulary-daily-activities",
      description: "Materi kosakata Bahasa Inggris tentang aktivitas sehari-hari.",
      content: `
        <h2>Daily Activities Vocabulary</h2>
        <p>Materi ini membahas kosakata yang sering digunakan untuk menjelaskan aktivitas harian.</p>

        <ul>
          <li>wake up = bangun tidur</li>
          <li>take a bath = mandi</li>
          <li>have breakfast = sarapan</li>
          <li>go to school = pergi ke sekolah</li>
          <li>study English = belajar Bahasa Inggris</li>
          <li>do homework = mengerjakan PR</li>
          <li>go to bed = tidur</li>
        </ul>
      `,
      category: "vocabulary",
      material_type: "basic",
      level: "beginner",
      estimated_time: 15,
      points_reward: 100,
      is_active: true,
    });

    const grammarMaterial = await Material.create({
      title: "Grammar: Simple Present Tense",
      slug: "grammar-simple-present-tense",
      description: "Materi grammar tentang penggunaan Simple Present Tense.",
      content: `
        <h2>Simple Present Tense</h2>
        <p>Simple Present Tense digunakan untuk menyatakan kebiasaan, fakta, dan aktivitas rutin.</p>

        <h3>Rumus</h3>
        <p>Subject + Verb 1 + Object</p>

        <h3>Contoh</h3>
        <ul>
          <li>I study English every day.</li>
          <li>She goes to school every morning.</li>
          <li>They play football after school.</li>
        </ul>
      `,
      category: "grammar",
      material_type: "basic",
      level: "beginner",
      estimated_time: 20,
      points_reward: 100,
      is_active: true,
    });

    const conversationMaterial = await Material.create({
      title: "Daily Conversation Practice",
      slug: "daily-conversation-practice",
      description: "Materi pengayaan untuk melatih percakapan Bahasa Inggris sehari-hari.",
      content: `
        <h2>Daily Conversation Practice</h2>
        <p>Materi ini membantu siswa melatih speaking melalui percakapan sederhana.</p>

        <h3>Example Dialogue</h3>
        <p>Alya: Hi, Bima. What do you usually do in the morning?</p>
        <p>Bima: I usually wake up at five o'clock and have breakfast at six.</p>
        <p>Alya: Do you go to school by bus?</p>
        <p>Bima: No, I go to school by bicycle.</p>
      `,
      category: "speaking",
      material_type: "enrichment",
      level: "intermediate",
      estimated_time: 15,
      points_reward: 120,
      is_active: true,
    });

    const readingMaterial = await Material.create({
      title: "Reading: My Daily Routine",
      slug: "reading-my-daily-routine",
      description: "Materi reading pendek tentang rutinitas harian.",
      content: `
        <h2>My Daily Routine</h2>
        <p>I wake up at five o'clock every morning. I take a bath and have breakfast with my family. After that, I go to school by bicycle.</p>
        <p>In the evening, I do my homework and study English. I usually go to bed at nine o'clock.</p>
      `,
      category: "reading",
      material_type: "practice",
      level: "beginner",
      estimated_time: 15,
      points_reward: 100,
      is_active: true,
    });

    console.log("Membuat kuis English...");

    await Quiz.create({
      title: "Daily Routine Vocabulary Quiz",
      description: "Kuis untuk menguji pemahaman vocabulary tentang daily activities.",
      material: vocabularyMaterial._id,
      total_points: 100,
      time_limit: 600,
      is_active: true,
      questions: [
        {
          question_text: 'What is the meaning of "wake up" in Indonesian?',
          options: ["Tidur malam", "Bangun tidur", "Pergi ke sekolah", "Makan siang"],
          correct_answer_index: 1,
          explanation: '"Wake up" berarti bangun tidur.',
          skill_focus: "vocabulary",
        },
        {
          question_text: 'What is the meaning of "have breakfast"?',
          options: ["Sarapan", "Mengerjakan PR", "Bermain game", "Tidur"],
          correct_answer_index: 0,
          explanation: '"Have breakfast" berarti sarapan.',
          skill_focus: "vocabulary",
        },
        {
          question_text: 'What is the meaning of "do homework"?',
          options: ["Membaca buku", "Pergi tidur", "Mengerjakan PR", "Mandi pagi"],
          correct_answer_index: 2,
          explanation: '"Do homework" berarti mengerjakan PR.',
          skill_focus: "vocabulary",
        },
      ],
    });

    await Quiz.create({
      title: "Simple Present Tense Quiz",
      description: "Kuis untuk menguji pemahaman Simple Present Tense.",
      material: grammarMaterial._id,
      total_points: 100,
      time_limit: 600,
      is_active: true,
      questions: [
        {
          question_text: "Choose the correct Simple Present sentence.",
          options: [
            "She go to school every day.",
            "She goes to school every day.",
            "She going to school every day.",
            "She gone to school every day.",
          ],
          correct_answer_index: 1,
          explanation: "Untuk subject 'She', verb mendapat tambahan -s/-es.",
          skill_focus: "grammar",
        },
        {
          question_text: "Complete the sentence: I ___ English every day.",
          options: ["studies", "study", "studying", "studied"],
          correct_answer_index: 1,
          explanation: "Untuk subject 'I', gunakan verb 1 tanpa tambahan -s.",
          skill_focus: "grammar",
        },
        {
          question_text: "Choose the correct negative sentence.",
          options: [
            "I do not play games before studying.",
            "I does not play games before studying.",
            "I am not play games before studying.",
            "I not play games before studying.",
          ],
          correct_answer_index: 0,
          explanation: "Negative Simple Present untuk 'I' menggunakan 'do not'.",
          skill_focus: "grammar",
        },
      ],
    });

    await Quiz.create({
      title: "Daily Conversation Practice Quiz",
      description: "Kuis pengayaan untuk vocabulary, grammar, dan daily conversation.",
      material: conversationMaterial._id,
      total_points: 100,
      time_limit: 600,
      is_active: true,
      questions: [
        {
          question_text: 'Complete the conversation: A: How are you today? B: ___',
          options: [
            "I am fine, thank you.",
            "I wake up at five.",
            "I go to school.",
            "I do homework.",
          ],
          correct_answer_index: 0,
          explanation: "Jawaban yang tepat untuk 'How are you today?' adalah 'I am fine, thank you.'",
          skill_focus: "speaking",
        },
        {
          question_text: "Which sentence talks about a daily routine?",
          options: [
            "I usually wake up at 5 a.m.",
            "I went to Bali last year.",
            "I am watching TV now.",
            "I will study tomorrow.",
          ],
          correct_answer_index: 0,
          explanation: "Kata 'usually' menunjukkan kebiasaan atau rutinitas.",
          skill_focus: "reading",
        },
        {
          question_text: "Complete the sentence: He ___ breakfast at six o'clock.",
          options: ["have", "has", "having", "had"],
          correct_answer_index: 1,
          explanation: "Untuk subject 'He', gunakan 'has'.",
          skill_focus: "grammar",
        },
      ],
    });

    console.log("Seeder berhasil dijalankan.");
    process.exit(0);
  } catch (error) {
    console.error("Seeder gagal:", error.message);
    process.exit(1);
  }
};

seedEnglishData();