// K-Poll JavaScript Implementation
class KnowledgePoll {
    constructor() {
        this.polls = JSON.parse(localStorage.getItem('k-polls')) || [];
        this.currentQuestionIndex = 0;
        this.currentPoll = null;
        this.userAnswers = [];
        this.questionCount = 1;
        
        this.init();
    }

    init() {
        // Load existing polls on page load
        this.loadPolls();
        this.loadResults();
        
        // Bind form submission
        document.getElementById('poll-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPoll();
        });
    }

    // Tab navigation
    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(tabName).classList.add('active');
        
        // Add active class to clicked button
        event.target.classList.add('active');
        
        // Refresh content based on tab
        if (tabName === 'participate') {
            this.loadPolls();
        } else if (tabName === 'results') {
            this.loadResults();
        }
    }

    // Add new question to the form
    addQuestion() {
        this.questionCount++;
        const questionsContainer = document.getElementById('questions-container');
        
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.innerHTML = `
            <div class="form-group">
                <label>Question ${this.questionCount}:</label>
                <input type="text" class="question-text" required placeholder="Enter your question">
            </div>
            <div class="options-container">
                <div class="form-group">
                    <label>Option A:</label>
                    <input type="text" class="option" required placeholder="Option A">
                </div>
                <div class="form-group">
                    <label>Option B:</label>
                    <input type="text" class="option" required placeholder="Option B">
                </div>
                <div class="form-group">
                    <label>Option C:</label>
                    <input type="text" class="option" placeholder="Option C (optional)">
                </div>
                <div class="form-group">
                    <label>Option D:</label>
                    <input type="text" class="option" placeholder="Option D (optional)">
                </div>
                <div class="form-group">
                    <label>Correct Answer:</label>
                    <select class="correct-answer" required>
                        <option value="">Select correct answer</option>
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                    </select>
                </div>
            </div>
            <button type="button" class="remove-question" onclick="this.parentElement.remove()">Remove Question</button>
        `;
        
        questionsContainer.appendChild(questionItem);
    }

    // Create new poll
    createPoll() {
        const title = document.getElementById('poll-title').value;
        const category = document.getElementById('poll-category').value;
        
        const questions = [];
        const questionItems = document.querySelectorAll('.question-item');
        
        questionItems.forEach((item, index) => {
            const questionText = item.querySelector('.question-text').value;
            const options = Array.from(item.querySelectorAll('.option')).map(input => input.value).filter(val => val.trim() !== '');
            const correctAnswer = item.querySelector('.correct-answer').value;
            
            if (questionText && options.length >= 2 && correctAnswer) {
                questions.push({
                    question: questionText,
                    options: options,
                    correctAnswer: correctAnswer,
                    optionLabels: ['A', 'B', 'C', 'D'].slice(0, options.length)
                });
            }
        });

        if (questions.length === 0) {
            alert('Please add at least one complete question.');
            return;
        }

        const poll = {
            id: Date.now(),
            title: title,
            category: category,
            questions: questions,
            createdAt: new Date().toISOString(),
            participants: 0,
            responses: []
        };

        this.polls.push(poll);
        this.savePolls();
        
        alert('Poll created successfully!');
        this.resetForm();
        this.showTab('participate');
    }

    // Reset the form
    resetForm() {
        document.getElementById('poll-form').reset();
        const questionsContainer = document.getElementById('questions-container');
        const questionItems = questionsContainer.querySelectorAll('.question-item');
        
        // Remove all but the first question
        for (let i = 1; i < questionItems.length; i++) {
            questionItems[i].remove();
        }
        
        this.questionCount = 1;
    }

    // Load polls for participation
    loadPolls() {
        const pollsList = document.getElementById('polls-list');
        
        if (this.polls.length === 0) {
            pollsList.innerHTML = '<p>No polls available. Create one to get started!</p>';
            return;
        }

        pollsList.innerHTML = this.polls.map(poll => `
            <div class="poll-card">
                <span class="poll-category">${poll.category}</span>
                <h3>${poll.title}</h3>
                <div class="poll-stats">
                    <p>${poll.questions.length} questions • ${poll.participants} participants</p>
                    <p>Created: ${new Date(poll.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="poll-actions">
                    <button onclick="poll.startPoll(${poll.id})">Take Poll</button>
                    <button onclick="poll.viewPollResults(${poll.id})">View Results</button>
                </div>
            </div>
        `).join('');
    }

    // Start taking a poll
    startPoll(pollId) {
        this.currentPoll = this.polls.find(p => p.id === pollId);
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        
        this.showQuizInterface();
    }

    // Show quiz interface
    showQuizInterface() {
        const participateTab = document.getElementById('participate');
        const quiz = this.generateQuizHTML();
        participateTab.innerHTML = quiz;
        
        this.displayCurrentQuestion();
    }

    // Generate quiz HTML
    generateQuizHTML() {
        return `
            <div class="quiz-container">
                <h2>${this.currentPoll.title}</h2>
                <div class="quiz-progress">
                    Question <span id="current-question">1</span> of ${this.currentPoll.questions.length}
                </div>
                <div id="question-container" class="question-container">
                    <!-- Question content will be inserted here -->
                </div>
                <div class="quiz-navigation">
                    <button class="prev-btn" onclick="poll.previousQuestion()" style="display: none;">Previous</button>
                    <button class="next-btn" onclick="poll.nextQuestion()">Next</button>
                </div>
            </div>
        `;
    }

    // Display current question
    displayCurrentQuestion() {
        const question = this.currentPoll.questions[this.currentQuestionIndex];
        const questionContainer = document.getElementById('question-container');
        const currentQuestionSpan = document.getElementById('current-question');
        
        currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        
        questionContainer.innerHTML = `
            <div class="question-number">Question ${this.currentQuestionIndex + 1}</div>
            <div class="question-text">${question.question}</div>
            <div class="answer-options">
                ${question.options.map((option, index) => `
                    <button class="answer-option" data-answer="${question.optionLabels[index]}" onclick="poll.selectAnswer('${question.optionLabels[index]}')">
                        ${question.optionLabels[index]}. ${option}
                    </button>
                `).join('')}
            </div>
        `;
        
        // Update navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        prevBtn.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
        nextBtn.textContent = this.currentQuestionIndex === this.currentPoll.questions.length - 1 ? 'Finish' : 'Next';
        
        // Restore previous answer if exists
        if (this.userAnswers[this.currentQuestionIndex]) {
            this.selectAnswer(this.userAnswers[this.currentQuestionIndex], false);
        }
    }

    // Select an answer
    selectAnswer(answer, save = true) {
        // Remove previous selection
        document.querySelectorAll('.answer-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked option
        document.querySelector(`[data-answer="${answer}"]`).classList.add('selected');
        
        if (save) {
            this.userAnswers[this.currentQuestionIndex] = answer;
        }
    }

    // Navigate to next question
    nextQuestion() {
        if (!this.userAnswers[this.currentQuestionIndex]) {
            alert('Please select an answer before proceeding.');
            return;
        }
        
        if (this.currentQuestionIndex < this.currentPoll.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
        } else {
            this.finishPoll();
        }
    }

    // Navigate to previous question
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    }

    // Finish poll and show results
    finishPoll() {
        const score = this.calculateScore();
        
        // Save response
        const response = {
            timestamp: new Date().toISOString(),
            answers: [...this.userAnswers],
            score: score
        };
        
        this.currentPoll.responses.push(response);
        this.currentPoll.participants++;
        this.savePolls();
        
        this.showPollResults(score);
    }

    // Calculate score
    calculateScore() {
        let correct = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.currentPoll.questions[index].correctAnswer) {
                correct++;
            }
        });
        return {
            correct: correct,
            total: this.currentPoll.questions.length,
            percentage: Math.round((correct / this.currentPoll.questions.length) * 100)
        };
    }

    // Show poll results
    showPollResults(score) {
        const participateTab = document.getElementById('participate');
        
        const resultHTML = `
            <div class="quiz-container">
                <h2>Poll Results: ${this.currentPoll.title}</h2>
                <div class="result-summary">
                    <div class="score">Your Score: ${score.correct}/${score.total} (${score.percentage}%)</div>
                    <p>You answered ${score.correct} out of ${score.total} questions correctly.</p>
                </div>
                
                <div class="result-details">
                    <h3>Detailed Results</h3>
                    ${this.currentPoll.questions.map((question, index) => {
                        const userAnswer = this.userAnswers[index];
                        const isCorrect = userAnswer === question.correctAnswer;
                        const userOption = question.options[question.optionLabels.indexOf(userAnswer)];
                        const correctOption = question.options[question.optionLabels.indexOf(question.correctAnswer)];
                        
                        return `
                            <div class="result-question ${isCorrect ? 'correct' : 'incorrect'}">
                                <h4>Question ${index + 1}: ${question.question}</h4>
                                <p><strong>Your answer:</strong> ${userAnswer}. ${userOption} ${isCorrect ? '✓' : '✗'}</p>
                                ${!isCorrect ? `<p><strong>Correct answer:</strong> ${question.correctAnswer}. ${correctOption}</p>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="mt-20">
                    <button onclick="poll.loadPolls(); poll.showTab('participate')">Back to Polls</button>
                    <button onclick="poll.showTab('results')">View All Results</button>
                </div>
            </div>
        `;
        
        participateTab.innerHTML = resultHTML;
    }

    // View results for a specific poll
    viewPollResults(pollId) {
        const targetPoll = this.polls.find(p => p.id === pollId);
        const resultsTab = document.getElementById('results');
        
        if (!targetPoll.responses.length) {
            resultsTab.innerHTML = `
                <h2>Results for: ${targetPoll.title}</h2>
                <p>No one has taken this poll yet.</p>
                <button onclick="poll.loadResults()">Back to All Results</button>
            `;
            this.showTab('results');
            return;
        }

        const stats = this.calculatePollStatistics(targetPoll);
        
        resultsTab.innerHTML = `
            <h2>Results for: ${targetPoll.title}</h2>
            <div class="poll-statistics">
                <h3>Overall Statistics</h3>
                <p><strong>Total Participants:</strong> ${targetPoll.participants}</p>
                <p><strong>Average Score:</strong> ${stats.averageScore}%</p>
                <p><strong>Highest Score:</strong> ${stats.highestScore}%</p>
                <p><strong>Most Recent:</strong> ${new Date(stats.mostRecent).toLocaleString()}</p>
            </div>
            
            <div class="question-analytics">
                <h3>Question Analysis</h3>
                ${targetPoll.questions.map((question, index) => `
                    <div class="question-stat">
                        <h4>Question ${index + 1}: ${question.question}</h4>
                        <p>Correct answers: ${stats.questionStats[index].correct}/${targetPoll.participants} (${stats.questionStats[index].percentage}%)</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="mt-20">
                <button onclick="poll.loadResults()">Back to All Results</button>
            </div>
        `;
        
        this.showTab('results');
    }

    // Calculate poll statistics
    calculatePollStatistics(targetPoll) {
        const responses = targetPoll.responses;
        const scores = responses.map(r => r.score.percentage);
        
        const questionStats = targetPoll.questions.map((question, qIndex) => {
            const correct = responses.filter(r => r.answers[qIndex] === question.correctAnswer).length;
            return {
                correct: correct,
                percentage: Math.round((correct / responses.length) * 100)
            };
        });

        return {
            averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            highestScore: Math.max(...scores),
            mostRecent: responses[responses.length - 1].timestamp,
            questionStats: questionStats
        };
    }

    // Load all results
    loadResults() {
        const resultsContainer = document.getElementById('results-container');
        
        const pollsWithResults = this.polls.filter(poll => poll.responses.length > 0);
        
        if (pollsWithResults.length === 0) {
            resultsContainer.innerHTML = '<p>No results available yet. Take some polls to see results!</p>';
            return;
        }

        resultsContainer.innerHTML = pollsWithResults.map(poll => {
            const stats = this.calculatePollStatistics(poll);
            return `
                <div class="poll-card">
                    <span class="poll-category">${poll.category}</span>
                    <h3>${poll.title}</h3>
                    <div class="poll-stats">
                        <p>${poll.participants} participants • Average: ${stats.averageScore}%</p>
                        <p>Created: ${new Date(poll.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="poll-actions">
                        <button onclick="poll.viewPollResults(${poll.id})">View Detailed Results</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Save polls to localStorage
    savePolls() {
        localStorage.setItem('k-polls', JSON.stringify(this.polls));
    }
}

// Global functions
function showTab(tabName) {
    poll.showTab(tabName);
}

function addQuestion() {
    poll.addQuestion();
}

// Initialize the application
const poll = new KnowledgePoll();