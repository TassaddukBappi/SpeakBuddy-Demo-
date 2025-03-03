from sentence_transformers import SentenceTransformer, util
from transformers import T5ForConditionalGeneration, T5Tokenizer, pipeline
import pandas as pd
import pickle
import torch
import numpy as np
import spacy
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

class dataProcessingAndSuggestion:

    def vectorisedText(text):
        embedder = SentenceTransformer('all-mpnet-base-v2')
        query_embedding = embedder.encode(text, convert_to_numpy=True)
        binaryTextData = (pickle.dumps(query_embedding)).hex()

        return binaryTextData
    
    def fetchDataset(voice_data):
        try:
            convertInput = dataProcessingAndSuggestion.vectorisedText(voice_data)
            dataset = pd.read_csv('dataset.txt', delimiter='\t')

            feedbackList = dataset.iloc[:, 0].tolist()
            inputList = [feedbackData for feedback, feedbackData in dataset.iterrows()]
            dataInputObject = [bytes.fromhex(inputData.name) for inputData in inputList]

            queries = [pickle.loads(bytes.fromhex(convertInput))]
            query_embedding = np.asanyarray(queries)

            corpus = [pickle.loads(text) for text in dataInputObject]
            corpus_embeddings = np.asanyarray(corpus)

            # calculating semantic similarity and getting result
            top_k = min(1, len(corpus))  
            cos_scores = util.cos_sim(query_embedding, corpus_embeddings)[0]
            top_results = torch.topk(cos_scores, k=top_k) 

            for score, idx in zip(top_results[0], top_results[1]):
                print("(Score: {:.4f})".format(score))
                matched = "{:.2f}".format(float("{:.4f}".format(score))*100)
                if float(matched) > 75.00:
                    print("Found!")
                    voice_data = feedbackList[idx]
                else:
                    voice_data = "I am too young to understand your words!"
        except Exception as ex:
            print(ex)
            voice_data = "My internal function is not working properly! Sorry, I cann't help you right now!"
        return voice_data

    def addUserInput(vectorisedInput, selectedOutput):
        newData = [
            {"userInput": vectorisedInput, "feedback": selectedOutput}
        ]
        df = pd.DataFrame(newData)
        try:
            df.to_csv('dataset.txt', mode='a', sep='\t', header=False, index=False)
        except Exception as ex:
            print(ex)

    def checkGrammer(text):
        # Load the T5 tokenizer and model for grammar correction
        tokenizer = T5Tokenizer.from_pretrained("t5-base")
        model = T5ForConditionalGeneration.from_pretrained("t5-base")

        # Prepare the input text for the model
        input_text = f"correct grammar: {text}"

        # Tokenize the input
        inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True)

        # Generate a corrected sentence
        with torch.no_grad():
            outputs = model.generate(**inputs, max_length=128)

        # Decode the generated output
        corrected_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

        # Display the corrected text
        print(f"Corrected Text: {corrected_text}")
        return corrected_text
    
    def getSummary(text):

        # Load T5 model and tokenizer
        model = T5ForConditionalGeneration.from_pretrained("t5-base")
        tokenizer = T5Tokenizer.from_pretrained("t5-base")

        def chunk_text(text, tokenizer, max_length=512):
            tokens = tokenizer(text, return_tensors="pt", truncation=False)["input_ids"][0]
            chunks = [tokens[i:i + max_length] for i in range(0, len(tokens), max_length)]
            return [tokenizer.decode(chunk, skip_special_tokens=True) for chunk in chunks]

        chunks = chunk_text(text, tokenizer)

        # Summarize each chunk
        summaries = []
        for chunk in chunks:
            inputs = tokenizer("summarize: " + chunk, return_tensors="pt", max_length=512, truncation=True)
            outputs = model.generate(inputs.input_ids, max_length=50, no_repeat_ngram_size=2)
            summaries.append(tokenizer.decode(outputs[0], skip_special_tokens=True))

        # Combine summaries
        final_summary = " ".join(summaries)

        return final_summary


class ChatbotSession:
    
    def extract_entity(self, text):
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(text)
        entities = [(ent.text, ent.label_) for ent in doc.ents]
        return entities[0] if entities else None

    def __init__(self):
        self.session_context = {}

    def handle_input(self, user_input):
        # Extract entity from user input (simplified)
        entity = ChatbotSession.extract_entity(user_input)

        if entity:
            # Store the entity in session context
            self.session_context['entity'] = entity
            response = "Got it! I'll remember " + entity
        else:
            response = "I'm here to help. How can I assist you?"

        return response

    def get_context(self):
        return self.session_context

    def end_session(self):
        self.session_context = {}