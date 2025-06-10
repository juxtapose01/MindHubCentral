import React, { useState } from "react";

const AssessmentPage = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: 1,
      text: "How often do you feel overwhelmed or stressed?",
      options: ["Never", "Sometimes", "Often", "Always"],
    },
    {
      id: 2,
      text: "Do you have trouble sleeping due to worry?",
      options: ["Never", "Sometimes", "Often", "Always"],
    },
    {
      id: 3,
      text: "How often do you feel unable to cope with daily tasks?",
      options: ["Never", "Sometimes", "Often", "Always"],
    },
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const calculateResult = async () => {
    const scores = { Never: 0, Sometimes: 1, Often: 2, Always: 3 };
    const totalScore = Object.values(answers).reduce(
      (sum, answer) => sum + scores[answer],
      0
    );
    const maxScore = questions.length * 3;

    let feedback = "";

    if (totalScore <= maxScore * 0.3) {
      feedback =
        "You seem to be managing well. Keep up your self-care routine!";
    } else if (totalScore <= maxScore * 0.6) {
      feedback =
        "You may be experiencing moderate stress. Try our breathing exercises or reach out to OSU Counseling at (405) 744-5458.";
    } else {
      feedback =
        "You might be experiencing high stress. Please consider contacting OSU Counseling at (405) 744-5458 or the National Suicide Lifeline at 988 for support.";
    }

    // Save result to backend
    try {
      await fetch("http://localhost:8001/save-result/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "anonymous", // Or fetch from auth
          score: totalScore,
          result_text: feedback,
        }),
      });
    } catch (err) {
      console.error("Failed to save result", err);
    }

    setResult(feedback);
  };

  return (
    <section className="assessment-page">
      <h2>Self-Assessment: Stress Check</h2>
      <p>
        Answer the following questions to gauge your stress levels. This is not
        a clinical diagnosis.
      </p>
      {questions.map((q) => (
        <div key={q.id} className="question">
          <p>{q.text}</p>
          <div className="options">
            {q.options.map((option) => (
              <button
                key={option}
                className={`option-btn ${
                  answers[q.id] === option ? "selected" : ""
                }`}
                onClick={() => handleAnswer(q.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      {Object.keys(answers).length === questions.length && (
        <button className="submit-btn" onClick={calculateResult}>
          See Results
        </button>
      )}
      {result && (
        <div className="result">
          <h3>Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </section>
  );
};

export default AssessmentPage;
