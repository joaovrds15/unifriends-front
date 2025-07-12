import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const AffinityQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/questions`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 403) {
          setError('Você já respondeu ao questionário.');
          setIsLoading(false);
          return;
        }

        if (!response.ok && response.status !== 403) {
          throw new Error('Failed to fetch questions');
        }

        const responseData = await response.json();
        setQuestions(responseData.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to load questions');
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      const answerData = answers[currentQuestion.id];
      setSelectedAnswer(answerData ? answerData.optionText : '');
    }
  }, [currentQuestionIndex, questions, answers]);

  const handleAnswerSelect = (optionId, optionText) => {
    setSelectedAnswer(optionText);

    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          optionId: optionId,
          optionText: optionText
        }
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitAnswers();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitAnswers = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answerData]) => ({
        question_id: parseInt(questionId),
        option_id: answerData.optionId,
      }));

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/answer/save`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          quiz_id: 1,
          answers: formattedAnswers
        }),
      });

      if (response.ok) {
        navigate('/affinity');
      } else {
        setError('Failed to submit answers');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      setError('Failed to submit answers');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen max-w-md bg-white mx-auto">
        <Header />
        <div className="flex-grow p-5 overflow-y-auto flex items-center justify-center">
          <p className="text-gray-500">Loading questions...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen max-w-md bg-white mx-auto">
        <Header />
        <div className="flex-grow p-5 overflow-y-auto flex items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col h-screen max-w-md bg-white mx-auto">
        <Header />
        <div className="flex-grow p-5 overflow-y-auto flex items-center justify-center">
          <p className="text-gray-500">No questions available</p>
        </div>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="flex flex-col h-screen max-w-md bg-white mx-auto">
      <Header />
      <div className="flex-grow p-5 overflow-y-auto">
        <p className="text-gray-500 text-sm mb-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <h2 className="text-xl font-medium text-gray-800 mb-6">{currentQuestion.text}</h2>
        <div className="flex flex-col gap-3">
          {currentQuestion.options?.map((option) => (
            <button
              key={option.id}
              className={`w-full px-4 py-4 text-base text-left border rounded-lg transition-all
                ${selectedAnswer === option.option_text
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              onClick={() => handleAnswerSelect(option.id, option.option_text)}
            >
              {option.option_text}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center mt-8">
          <button
            className="flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg border-none bg-gray-200 text-gray-700 transition hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg border-none bg-green-600 text-white transition hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            {isLastQuestion ? 'Submit' : 'Next'}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AffinityQuiz;