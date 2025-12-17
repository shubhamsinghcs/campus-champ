import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

function Leaderboard({ fallbackMessage }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const q = query(
          collection(db, "scores"),
          orderBy("score", "desc"),
          limit(10)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => doc.data());
        setScores(data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Campus Champs Leaderboard</h2>
      {scores.length === 0 ? (
        fallbackMessage || <p>No scores submitted yet.</p>
      ) : (
        <ol className="space-y-2">
          {scores.map((s, i) => (
            <li key={i}>
              <strong>{s.name}</strong> — {s.score} pts
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Leaderboard;
