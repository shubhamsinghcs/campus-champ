import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const SLUG_TO_TITLE = {
  "ai": "AI",
  "web-development": "Web Development",
  "python": "Python",
  "graphic-design": "Graphic Design",
};

function Quiz() {
  const { category } = useParams(); // Slug like "ai" or "web-development"
  const navigate = useNavigate();
  const displayCategory = SLUG_TO_TITLE[category] || category;
  const userName = localStorage.getItem("userName") || "Participant";

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Query questions collection where 'category' field equals displayCategory
        const qRef = collection(db, "questions");
        const q = query(qRef, where("category", "==", displayCategory));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setQuestions(list);
      } catch (err) {
        console.error("Failed to load questions:", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  const handleChoose = (choiceIndex) => {
    if (selected !== null) return; // prevent double choose
    setSelected(choiceIndex);

    const q = questions[idx];
    let correctIndex = null;
    if (typeof q.correctIndex === "number") correctIndex = q.correctIndex;
    else if (typeof q.correct === "string" && Array.isArray(q.options)) {
      correctIndex = q.options.indexOf(q.correct);
    }

    if (correctIndex === choiceIndex) setScore((s) => s + 10); // 10 points per correct answer

    setTimeout(() => {
      setSelected(null);
      if (idx + 1 < questions.length) setIdx((i) => i + 1);
      else finishQuiz();
    }, 600);
  };

  const finishQuiz = async () => {
    setFinished(true);
    
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    userProfile.category = displayCategory;
    userProfile.score = score;
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    
    try {
      await addDoc(collection(db, "scores"), {
        name: userName,
        category: displayCategory,
        score,
        total: questions.length * 10, // Total possible points
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed saving score:", err);
    }
  };

  if (loading) return <div className="p-8">Loading questions...</div>;

  if (!questions.length)
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-center">No questions found for {displayCategory}</h2>
        <p className="mt-3 text-center">
          Make sure your Firestore has documents in <code className="bg-gray-100 p-1 rounded">questions</code> with field <code className="bg-gray-100 p-1 rounded">category: "{displayCategory}"</code>
        </p>
        <div className="mt-6 flex justify-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );

  if (finished)
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-6 shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Quiz finished!</h2>
          <p className="text-2xl mb-6">
            Score: <strong className="text-green-600">{score}</strong> / {questions.length * 10}
          </p>
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded" role="alert">
              <p>You earned {score} points for your knowledge!</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
            onClick={() => navigate("/dashboard")}
          >
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <button 
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
            onClick={() => navigate("/certificate")}
          >
            <span className="font-medium">View Certificate</span>
          </button>
          
          <button 
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition transform hover:scale-105"
            onClick={() => navigate(`/quiz/${category}`)}
          >
            <span className="font-medium">Generate More Questions</span>
          </button>
        </div>
      </div>
    );

  const q = questions[idx];

  return (
    <div className="min-h-screen flex items-start justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-700">{displayCategory} Quiz</h3>
          <div className="text-gray-600">Question {idx + 1} / {questions.length}</div>
        </div>

        <div className="mb-6">
          <p className="text-gray-800 text-lg">{q.question}</p>
        </div>

        <div className="grid gap-3">
          {Array.isArray(q.options) ? q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = selected === i && i === (q.correctIndex || q.options.indexOf(q.correct));
            const isIncorrect = selected === i && i !== (q.correctIndex || q.options.indexOf(q.correct));
            
            return (
              <button
                key={i}
                onClick={() => handleChoose(i)}
                disabled={selected !== null}
                className={`text-left p-3 rounded border transition-all duration-200 relative overflow-hidden ${
                  isSelected 
                    ? isCorrect 
                      ? "border-green-500 bg-green-50 text-green-800" 
                      : "border-red-500 bg-red-50 text-red-800"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isCorrect ? (
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    )}
                  </div>
                )}
                <span className={`relative ${isSelected ? 'pl-6' : ''}`}>{opt}</span>
              </button>
            );
          }) : <div className="text-sm text-gray-500">This question has no options configured.</div>}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-gray-600">Score: <strong className="text-blue-700 text-lg">{score}</strong></div>
          <div className="text-sm text-gray-500">Points per question: 10</div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
