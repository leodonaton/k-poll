// Sample data for K-Poll system
// This file contains example polls that can be loaded for demonstration

const samplePolls = [
    {
        id: 1,
        title: "Basic Science Knowledge",
        category: "science",
        questions: [
            {
                question: "What is the chemical symbol for water?",
                options: ["H2O", "CO2", "NaCl", "O2"],
                correctAnswer: "A",
                optionLabels: ["A", "B", "C", "D"]
            },
            {
                question: "Which planet is closest to the sun?",
                options: ["Mercury", "Venus", "Earth", "Mars"],
                correctAnswer: "A",
                optionLabels: ["A", "B", "C", "D"]
            },
            {
                question: "What gas do plants absorb from the atmosphere during photosynthesis?",
                options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
                correctAnswer: "B",
                optionLabels: ["A", "B", "C", "D"]
            }
        ],
        createdAt: "2024-01-01T00:00:00.000Z",
        participants: 0,
        responses: []
    },
    {
        id: 2,
        title: "World Geography Quiz",
        category: "general",
        questions: [
            {
                question: "Which is the largest continent by area?",
                options: ["Africa", "Asia", "North America"],
                correctAnswer: "B",
                optionLabels: ["A", "B", "C"]
            },
            {
                question: "What is the capital of Australia?",
                options: ["Sydney", "Melbourne", "Canberra", "Perth"],
                correctAnswer: "C",
                optionLabels: ["A", "B", "C", "D"]
            },
            {
                question: "Which river is the longest in the world?",
                options: ["Amazon", "Nile", "Yangtze"],
                correctAnswer: "B",
                optionLabels: ["A", "B", "C"]
            }
        ],
        createdAt: "2024-01-02T00:00:00.000Z",
        participants: 0,
        responses: []
    },
    {
        id: 3,
        title: "Programming Fundamentals",
        category: "technology",
        questions: [
            {
                question: "What does HTML stand for?",
                options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language"],
                correctAnswer: "A",
                optionLabels: ["A", "B", "C"]
            },
            {
                question: "Which of these is NOT a programming language?",
                options: ["Python", "JavaScript", "HTML", "Java"],
                correctAnswer: "C",
                optionLabels: ["A", "B", "C", "D"]
            }
        ],
        createdAt: "2024-01-03T00:00:00.000Z",
        participants: 0,
        responses: []
    }
];

// Function to load sample data (can be called from browser console)
function loadSampleData() {
    localStorage.setItem('k-polls', JSON.stringify(samplePolls));
    console.log('Sample polls loaded! Refresh the page to see them.');
    alert('Sample polls loaded! Refresh the page to see them in the Participate tab.');
}

// Auto-load sample data if no polls exist
if (typeof window !== 'undefined' && window.localStorage) {
    const existingPolls = localStorage.getItem('k-polls');
    if (!existingPolls || JSON.parse(existingPolls).length === 0) {
        // Automatically load sample data on first visit
        setTimeout(() => {
            const userWantsSample = confirm('Welcome to K-Poll! Would you like to load some sample polls to get started?');
            if (userWantsSample) {
                loadSampleData();
                location.reload();
            }
        }, 1000);
    }
}