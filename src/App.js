import React, { useEffect, useState } from "react";

const AnswerKeyDisplay = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('questions.json');
        const data = await response.text();
        const questions = JSON.parse(data);
        
        const processedQuestions = questions.map((q, index) => ({
          id: `q${index + 1}`,
          question: q.question,
          answers: q.answers.map(a => ({
            text: a.answerText,
            points: a.points
          }))
        }));
        
        setAllQuestions(processedQuestions);
        setCurrentQuestion(processedQuestions[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleQuestionSelect = (questionId) => {
    const question = allQuestions.find(q => q.id === questionId);
    setCurrentQuestion(question);
  };

  const filteredQuestions = allQuestions.filter(q => 
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-700/50">
            <div className="text-2xl text-white text-center animate-pulse">
              Loading questions...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total points for current question
  const totalPoints = currentQuestion.answers.reduce((sum, answer) => sum + answer.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8 tracking-wider drop-shadow-lg">
          FRIENDLY FEUD ANSWER KEY
        </h1>

        {/* Search and Question Selection */}
        <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-700/50">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 
                       text-white placeholder-slate-400 focus:outline-none focus:ring-2 
                       focus:ring-yellow-400"
            />
            <select 
              className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 
                       text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={currentQuestion.id}
              onChange={(e) => handleQuestionSelect(e.target.value)}
            >
              {filteredQuestions.map((q) => (
                <option key={q.id} value={q.id} className="bg-slate-800">
                  {q.id.toUpperCase()}: {q.answers.length} answers - {q.question}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Question Display */}
        <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-700/50">
          <h2 className="text-2xl font-bold text-white mb-6">
            <span className="text-yellow-400 mr-2">{currentQuestion.id.toUpperCase()}:</span>
            {currentQuestion.question}
          </h2>

          {/* Answers List */}
          <div className="space-y-3">
            {currentQuestion.answers.map((answer, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/50 
                         rounded-lg border border-slate-600"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-yellow-400 text-slate-900 rounded-full 
                                flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </span>
                  <span className="text-white text-lg">{answer.text}</span>
                </div>
                <span className="font-bold text-xl text-yellow-400">{answer.points}</span>
              </div>
            ))}
          </div>

          {/* Total Points */}
          <div className="mt-6 pt-4 border-t border-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white">Total Points:</span>
              <span className="text-lg font-bold text-yellow-400">{totalPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap in an App component for standalone usage
const AnswerKeyApp = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AnswerKeyDisplay />
    </div>
  );
};

export default AnswerKeyApp;