# K-Poll - Knowledge Polling System

A simple, interactive web-based knowledge polling system that allows users to create, participate in, and view results of knowledge polls.

## Features

### 📊 Create Polls
- Create custom knowledge polls with multiple questions
- Support for multiple choice questions (2-4 options)
- Categorize polls by topic (General Knowledge, Science, History, Technology, Sports, Arts & Literature)
- Add multiple questions per poll
- Specify correct answers for each question

### 🎯 Participate in Polls
- Browse available polls by category
- Take interactive quizzes with immediate feedback
- Navigate between questions (previous/next)
- View detailed results after completion
- See correct answers and explanations

### 📈 View Results
- View overall poll statistics
- See individual poll performance analytics
- Track participation rates and average scores
- Analyze question-by-question performance
- Monitor most recent activity

## Getting Started

### Quick Start
1. Open `index.html` in your web browser
2. Click "Create Poll" to create your first knowledge poll
3. Add questions with multiple choice answers
4. Switch to "Participate" tab to take polls
5. Check "View Results" to see analytics

### Creating Your First Poll
1. **Navigate to Create Poll tab**
2. **Fill in poll details:**
   - Enter a descriptive poll title
   - Select a category from the dropdown
3. **Add questions:**
   - Enter your question text
   - Provide 2-4 answer options (A and B are required, C and D optional)
   - Select the correct answer
   - Click "Add Another Question" for multiple questions
4. **Create the poll:** Click "Create Poll" to save

### Taking a Poll
1. **Go to Participate tab**
2. **Select a poll** from the available list
3. **Answer questions:**
   - Read each question carefully
   - Click on your chosen answer
   - Use "Next" to proceed or "Previous" to go back
4. **View results:** See your score and detailed feedback

## Technical Details

### Architecture
- **Frontend:** Pure HTML5, CSS3, and JavaScript (ES6+)
- **Storage:** Browser localStorage for data persistence
- **Design:** Responsive design that works on desktop and mobile
- **No Backend Required:** Fully client-side application

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Data Storage
All poll data is stored locally in your browser using localStorage. Data includes:
- Poll definitions (questions, options, correct answers)
- User responses and scores
- Participation statistics
- Created timestamps

## File Structure
```
k-poll/
├── index.html          # Main application page
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript application logic
└── README.md           # Documentation (this file)
```

## Usage Examples

### Sample Poll Categories
- **General Knowledge:** Geography, current events, trivia
- **Science:** Biology, chemistry, physics concepts
- **History:** Historical events, dates, figures
- **Technology:** Programming, software, hardware
- **Sports:** Rules, statistics, famous athletes
- **Arts & Literature:** Famous works, authors, art movements

### Best Practices for Poll Creation
1. **Keep questions clear and concise**
2. **Provide plausible alternative answers**
3. **Ensure only one clearly correct answer**
4. **Test your poll before sharing**
5. **Use appropriate difficulty level for your audience**

## Features in Detail

### Poll Creation
- Dynamic question addition/removal
- Input validation for required fields
- Category-based organization
- Flexible answer options (2-4 choices)

### Quiz Interface
- Clean, intuitive question display
- Visual answer selection
- Progress tracking
- Navigation controls
- Answer persistence during navigation

### Results & Analytics
- Individual performance scoring
- Detailed answer review
- Poll-wide statistics
- Question difficulty analysis
- Participation tracking

## Customization

### Adding New Categories
Edit the category dropdown in `index.html`:
```html
<option value="new-category">New Category</option>
```

### Styling Modifications
Customize appearance by editing `styles.css`:
- Colors: Update CSS custom properties
- Layout: Modify container widths and spacing
- Fonts: Change font-family declarations

### Functionality Extensions
Extend features by modifying `script.js`:
- Add new question types
- Implement timer functionality
- Add export/import capabilities
- Create user authentication

## Browser Storage

The application uses localStorage to persist data across sessions:
- **Polls:** Stored as JSON array with all poll data
- **Responses:** Included within poll objects
- **Settings:** Future feature for user preferences

To clear all data: Open browser developer tools and run:
```javascript
localStorage.removeItem('k-polls');
```

## Contributing

This is a simple educational project. Feel free to:
1. Fork the repository
2. Make improvements
3. Add new features
4. Submit pull requests

## License

Open source - feel free to use, modify, and distribute.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Ensure JavaScript is enabled
3. Try refreshing the page
4. Clear localStorage if data seems corrupted

---

**K-Poll** - Making knowledge sharing interactive and engaging! 🎓