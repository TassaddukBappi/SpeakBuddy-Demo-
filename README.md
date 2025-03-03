# NLP-Based Voice Query & Text Similarity API  

## Overview  
This project is a full-stack web application that processes **voice-based queries** and finds the best-matched answer using **Semantic Textual Similarity (STS)**. The system includes:  
- **Backend**: A Flask API that processes voice input and retrieves the most relevant answer using NLP models.  
- **Frontend**: A React-based UI that allows users to speak or type queries and view responses.  

## Features  
### Backend (Flask API)  
✅ **Voice Query Processing**: Accepts voice input, converts it to text, and finds the best match.  
✅ **Semantic Textual Similarity (STS)**: Uses `SentenceTransformer` to compare query text with pre-existing answers.  
✅ **REST API**: Provides endpoints for text and voice-based query handling.  

### Frontend (React)  
✅ **Voice Input Support**: Allows users to ask queries using speech.  
✅ **Real-time Matching**: Sends user input to the API and fetches the most relevant response.  
✅ **Modern UI**: Built with React and Tailwind CSS for a smooth experience.  

## Technologies Used  
### Backend  
- 🛠 **Flask** – Lightweight Python web framework  
- 🌐 **Flask-CORS** – Enables cross-origin requests  
- 🔍 **Sentence-Transformers** – Generates embeddings for text similarity  
- 🤖 **Transformers (Hugging Face)** – Handles NLP processing  
- 🔥 **Torch** – Backend for deep learning models  
- 📖 **Spacy** – NLP text processing  
- 📏 **Scikit-Learn** – Used for cosine similarity calculations  

### Frontend  
- ⚛️ **React** – JavaScript library for the UI  
- 🔄 **Axios** – Handles API requests  
- 🎨 **Tailwind CSS** – For responsive styling  

## Installation  

### Prerequisites  
Ensure you have **Python 3.8+** and **Node.js 16+** installed.  

### Backend Setup  
1. **Clone the repository**  
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo/backend

2. **Create a virtual environment (optional but recommended)**  
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

3. **Install dependencies**  
   ```sh
   pip install -r requirements.txt

4. **Download Spacy’s language model (if needed)**  
   ```sh
   python -m spacy download en_core_web_sm

5. **Start the Flask server**  
   ```sh
   python app.py


### Frontend Setup
1. **Navigate to the frontend directory**
   ```sh
   cd ../frontend

2. **Install dependencies**
   ```sh
   npm install

3. **Start the React app**
   ```sh
   npm start

The frontend will run at: http://localhost:3000/

