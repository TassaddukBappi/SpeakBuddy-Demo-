# Name: SpeakBuddy
# Author: Tassadduk Talukdar
# Date: 22/07/2023

from flask import Flask, jsonify, request
from flask_cors import CORS
from nlpProcessing import dataProcessingAndSuggestion, ChatbotSession
from questionAnswerNLP import *

app = Flask(__name__)
CORS(app)  # Allows the React frontend to access the backend



# Route to handle voice data
@app.route('/api/process_voice', methods=['POST'])
def process_voice():
    try:
        data = request.json
        voice_data = data.get('voiceData', '')
        if voice_data != '':
            voice_data = dataProcessingAndSuggestion.fetchDataset(voice_data)
        else:
            voice_data = "Can you speak a bit clear and louder please!"

        
        # Replace this part with your specific processing logic.

        # Respond with an acknowledgment or any data back to the frontend
        responseData = {'message': voice_data}
        return jsonify(responseData), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/toTraining', methods=['POST'])
def toTraining():
    if request.method == 'POST':
        userName = request.form.get('currentUser').lower()

@app.route('/addData', methods=['POST', 'GET'])
def addData():
    if request.method == 'POST':
        userName = request.form.get('currentUser').lower()
        userInput = request.form.get('userInput')
        machineOutput = request.form.get('desiredOutput')
        
        vectoriseddata = dataProcessingAndSuggestion.vectorisedText(userInput)
        dataProcessingAndSuggestion.addUserInput(vectoriseddata, machineOutput)

    
@app.route('/returnToMain', methods=['POST'])
def toMain():
    if request.method == 'POST':
        userName = request.form.get('currentUser').lower()


# question answer topic
@app.route('/upload-file', methods=['POST'])
def upload_file():
    try:
        data = request.json
        document_json = []
        embedding = upload_text(data['uploadFile'])
        document_json.append({
            'documentID': embedding
        })
        return jsonify({'status': 'success', 'document': document_json})
    except Exception as ex:
        print (ex)
        return jsonify({'status': 'error'})
    

# fetch answer
@app.route('/fetch-answer', methods=['POST'])
def fetch_answer():
    try:
        data = request.json
        answer = answer_question(data['documentID'], data['question'])
        return jsonify({'status': 'success', 'answer': answer})
    except Exception as ex:
        print (ex)
        return jsonify({'status': 'error'})
    

if __name__=="__main__":
    app.run(use_reloader=False, debug=True)
