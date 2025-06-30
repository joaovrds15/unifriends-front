import React, { useState, useEffect } from 'react';
import '../components/components_css/AffinityQuiz.css';
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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/questions`, {
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


      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/answer/save`, {
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
      <div className="container">
        <Header />
        <div className="quiz-container">
          <p>Loading questions...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Header />
        <div className="quiz-container">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container">
        <Header />
        <div className="quiz-container">
          <p>No questions available</p>
        </div>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="container">
      <Header />
      <div className='quiz-container'>
        <p className="question-progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <h2 className="question-title">{currentQuestion.text}</h2>
        <div className="genre-options">
          {currentQuestion.options?.map((option) => (
            <button
              key={option.id}
              className={`genre-btn ${selectedAnswer === option.option_text ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(option.id, option.option_text)}
            >
              {option.option_text}
            </button>
          ))}
        </div>
        <div className="navigation-buttons">
          <button 
            className="back-btn" 
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            style={{ 
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back
          </button>
          <button 
            className="next-btn"
            onClick={handleNext}
            disabled={!selectedAnswer}
            style={{ 
              opacity: !selectedAnswer ? 0.5 : 1,
              cursor: !selectedAnswer ? 'not-allowed' : 'pointer'
            }}
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