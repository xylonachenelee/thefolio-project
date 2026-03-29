// frontend/src/pages/About.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ========== COOKING QUIZ COMPONENT ==========
const cookingQuizData = [
  {
    question: "What is the national dish of the Philippines?",
    options: ["Sinigang", "Adobo", "Lechon", "Kare-Kare"],
    answer: 1,
    explanation: "Adobo is widely considered the national dish of the Philippines, known for its savory vinegar and soy sauce marinade."
  },
  {
    question: "Which ingredient gives Sinigang its signature sour taste?",
    options: ["Calamansi", "Vinegar", "Tamarind", "Lemon"],
    answer: 2,
    explanation: "Sinigang gets its characteristic sour flavor from tamarind (sampaloc), though other souring agents like guava or kamias can also be used."
  },
  {
    question: "What type of meat is traditionally used in Kare-Kare?",
    options: ["Chicken", "Pork", "Beef oxtail and tripe", "Fish"],
    answer: 2,
    explanation: "Kare-Kare is traditionally made with beef oxtail and tripe, cooked in a rich peanut sauce, and served with bagoong (shrimp paste)."
  },
  {
    question: "Which Filipino dessert is made from purple yam?",
    options: ["Halo-Halo", "Leche Flan", "Ube Halaya", "Bibingka"],
    answer: 2,
    explanation: "Ube Halaya is a popular Filipino dessert made from mashed purple yam (ube), milk, butter, and sugar."
  },
  {
    question: "What is the main ingredient in Pancit Canton?",
    options: ["Rice noodles", "Egg noodles", "Mung bean noodles", "Corn noodles"],
    answer: 1,
    explanation: "Pancit Canton uses egg noodles (wheat noodles), which are stir-fried with vegetables, meat, and soy sauce."
  },
  {
    question: "What is the Filipino term for 'merienda'?",
    options: ["Breakfast", "Lunch", "Afternoon snack", "Dinner"],
    answer: 2,
    explanation: "Merienda refers to a light afternoon snack or tea time in Filipino culture, often enjoyed between main meals."
  },
  {
    question: "Which of these is a popular Filipino street food?",
    options: ["Balut", "Turon", "Fish balls", "All of the above"],
    answer: 3,
    explanation: "Balut (developing duck embryo), Turon (banana spring rolls), and fish balls are all beloved Filipino street foods."
  },
  {
    question: "What makes Bicol Express spicy?",
    options: ["Black pepper", "Chili peppers", "Ginger", "Wasabi"],
    answer: 1,
    explanation: "Bicol Express gets its heat from siling labuyo (bird's eye chili peppers) and is cooked with coconut milk."
  },
  {
    question: "What is 'lechon'?",
    options: ["Grilled chicken", "Fried pork", "Roasted whole pig", "Beef stew"],
    answer: 2,
    explanation: "Lechon is a whole roasted pig, often the centerpiece of Filipino fiestas and special occasions."
  },
  {
    question: "Which of these is a Filipino Christmas delicacy?",
    options: ["Bibingka", "Putong puti", "Sapin-sapin", "Kutsinta"],
    answer: 0,
    explanation: "Bibingka (rice cake) is traditionally enjoyed during the Christmas season, often sold outside churches during Simbang Gabi."
  }
];

function CookingQuiz() {
  const [gameState, setGameState] = useState('teaser');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answered, setAnswered] = useState(false);

  const totalQuestions = cookingQuizData.length;

  const startQuiz = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setAnswered(false);
    setShowExplanation(false);
  };

  const selectOption = (index) => {
    if (!answered) {
      setSelectedOption(index);
    }
  };

  const submitAnswer = () => {
    if (selectedOption === null) return;
    
    setAnswered(true);
    setShowExplanation(true);
    
    if (selectedOption === cookingQuizData[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setAnswered(false);
      setShowExplanation(false);
    } else {
      setGameState('results');
    }
  };

  const playAgain = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setAnswered(false);
    setShowExplanation(false);
  };

  const backToTeaser = () => {
    setGameState('teaser');
  };

  const getOptionClassName = (index) => {
    let className = 'quiz-option';
    
    if (selectedOption === index) {
      className += ' selected';
    }
    
    if (answered) {
      if (index === cookingQuizData[currentQuestion].answer) {
        className += ' correct';
      } else if (selectedOption === index && selectedOption !== cookingQuizData[currentQuestion].answer) {
        className += ' wrong';
      }
    }
    
    return className;
  };

  const getScoreMessage = () => {
    if (score === 10) {
      return { emoji: "🇵🇭👨‍🍳🌟", text: "Perfect score! You're a Filipino culinary master! 👨‍🍳🌟" };
    } else if (score >= 8) {
      return { emoji: "🍳👍🇵🇭", text: "Excellent! You really know your Filipino cuisine!" };
    } else if (score >= 6) {
      return { emoji: "👍", text: "Good job! You have solid Filipino cooking knowledge!" };
    } else if (score >= 4) {
      return { emoji: "👌", text: "Not bad! Keep exploring Filipino dishes!" };
    } else {
      return { emoji: "🌱🍚", text: "Keep learning - Filipino cuisine is rich and delicious!" };
    }
  };

  return (
    <div className="quiz-container">
      {gameState === 'teaser' && (
        <div className="quiz-teaser">
          <div className="teaser-content">
            <h3>🍳 Cooking Quiz Challenge</h3>
            <p>Think you know your way around the kitchen? Take this 10-question quiz to test your Filipino cooking knowledge!</p>
            <ul>
              <li>✅ 10 Filipino cooking questions</li>
              <li>✅ Multiple choice format</li>
            </ul>
            <button className="start-quiz-btn" onClick={startQuiz}>Start Game</button>
            <p className="teaser-note"><small>Challenge yourself and see how much you know about Filipino cuisine!</small></p>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="quiz-game">
          <div className="quiz-header">
            <div className="quiz-progress">
              Question {currentQuestion + 1} of {totalQuestions}
            </div>
          </div>
          
          <div className="quiz-box">
            <h3>{cookingQuizData[currentQuestion].question}</h3>
            <div className="quiz-options">
              {cookingQuizData[currentQuestion].options.map((option, index) => (
                <div 
                  key={index}
                  className={getOptionClassName(index)}
                  onClick={() => selectOption(index)}
                  style={answered ? { pointerEvents: 'none' } : {}}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </div>
              ))}
            </div>
            <div className="quiz-controls">
              {!answered ? (
                <button onClick={submitAnswer} disabled={selectedOption === null}>
                  Submit Answer
                </button>
              ) : (
                <button onClick={nextQuestion}>
                  {currentQuestion + 1 === totalQuestions ? 'View Score →' : 'Next Question →'}
                </button>
              )}
            </div>
            {showExplanation && (
              <div className={selectedOption === cookingQuizData[currentQuestion].answer ? 'correct-answer' : 'wrong-answer'}>
                {selectedOption === cookingQuizData[currentQuestion].answer ? '✅ ' : '❌ '}
                {cookingQuizData[currentQuestion].explanation}
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'results' && (
        <div className="quiz-results">
          <div className="results-content">
            <h3>🎉 Quiz Complete!</h3>
            <div className="final-score">
              Your Score: {score} out of 10
            </div>
            <div className="score-message">
              <div className="score-emoji">{getScoreMessage().emoji}</div>
              <div className="score-text">{getScoreMessage().text}</div>
            </div>
            <div className="results-actions">
              <button onClick={playAgain}>Play Again</button>
              <button onClick={backToTeaser}>Back to Quiz Home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== MAIN ABOUT COMPONENT ==========
function About() {
  return (
    <>
      <Navbar />
      
      {/* About Content Section */}
      <section>
        <div className="car-container">
          <div className="car">
            <h2>About This Website</h2>
            <p>
              This portfolio website was created to showcase my passion for cooking.
              It reflects my personal interests, learning journey, and the joy I find
              in preparing meals for myself and others. Cooking has taught me patience, creativity, and discipline. Through
              continuous practice and exploration, I have learned how small details
              like seasoning, timing, and presentation can make a big difference.
            </p>
          </div>
        </div>

        <div className="car-container">
          <div className="car">
            <div className="hero-text">
              <h2>My Cooking Journey</h2>
              <p>
                My journey with cooking started at home, watching and helping in the kitchen.
                Over time, curiosity turned into practice, and practice turned into passion.
              </p>

              <ol>
                <li>I started cooking simple meals at home when I was 10</li>
                <li>I learned recipes through my family and videos online</li>
                <li>I already cooked plenty of dishes through the years</li>
                <li>One of my favorite dishes that I've cooked is the "Chicken Adobo"</li>
                <li>Today I practiced plating and presentation</li>
                <li>Improved my skills through consistency and feedback</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="car-container">
          <div className="car">
            <img src="/food2.jpg" alt="food pic" />
          </div>
        </div>

        <div className="car-container">
          <div className="car">
            <h2>What Cooking Means to Me</h2>
            <p>
              Cooking is not just about food. It is a way to express care, creativity,
              and culture. Every dish I make represents effort and learning.
              Through cooking it teaches me discipline, confidence, and appreciation for the simple things,
              reminding me that even the smallest ingredients can create something meaningful when prepared with heart and dedication. 
            </p>

            <blockquote>
              <em>
                "Cooking requires confident guesswork and improvisation experimentation and substitution, dealing with failure and uncertainty in a creative way."
                – Paul Theroux
              </em>
            </blockquote>
          </div>
        </div>

        <div className="car-container">
          <div className="car">
            <h2>What Motivates Me</h2>
            <p>
              What motivates me is the desire to keep learning, try new recipes, and become better everyday.
              Each dish I make helps me gain confidence and improve my skills.
            </p>
            <div className="card-container">
              <div className="card">
                <img src="/comfort.jpg" alt="comfort means" />
                <h3>Comfort</h3>
                <p>
                  Cooking makes me feel home and relaxed.
                </p>
              </div>

              <div className="card">
                <img src="/love.jpg" alt="love means" />
                <h3>Love</h3>
                <p>
                  Cooking is my way to show care and effort for the people around me.
                </p>
              </div>

              <div className="card">
                <img src="/peace.jpg" alt="peace means" />
                <h3>Peace</h3>
                <p>
                  Cooking helps me feel calm and focused within myself.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="car-container">
          <div className="car">
            <h2>🎮 Test Your Cooking Knowledge</h2>
            <p>Ready for a fun challenge? Test your cooking skills with this interactive quiz!</p>
            <CookingQuiz />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;