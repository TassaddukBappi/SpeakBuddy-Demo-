from sentence_transformers import SentenceTransformer
from transformers import pipeline, AutoTokenizer
import uuid
from sklearn.metrics.pairwise import cosine_similarity

embedder = SentenceTransformer('all-MiniLM-L6-v2')  # For chunk embedding
qa_pipeline = pipeline("question-answering", model="deepset/roberta-large-squad2")
tokenizer = AutoTokenizer.from_pretrained("deepset/roberta-large-squad2")

# In-memory storage
documents = {}

# Utility function: Chunk text into overlapping sections
def chunk_text(text, max_length=512, overlap=50):
    tokens = tokenizer.encode(text, add_special_tokens=False)
    chunks = []
    for i in range(0, len(tokens), max_length - overlap):
        chunk_tokens = tokens[i:i + max_length]
        chunk_text = tokenizer.decode(chunk_tokens, skip_special_tokens=True)
        chunks.append(chunk_text)
        if i + max_length >= len(tokens):
            break
    return chunks

# Utility function: Compute embeddings for text chunks
def compute_embeddings(chunks):
    return embedder.encode(chunks, convert_to_tensor=True)

# Endpoint to upload text and process it
def upload_text(data):
    if not data:
        return "Text field is required"

    text = data

    # Create a unique document ID
    doc_id = str(uuid.uuid4())

    # Chunk the text and compute embeddings
    chunks = chunk_text(text)
    embeddings = compute_embeddings(chunks)

    # Store in memory
    documents[doc_id] = {
        "chunks": chunks,
        "embeddings": embeddings
    }

    return doc_id

# Retrieve relevant chunks for a question
def retrieve_relevant_chunks(question, chunks, embeddings, top_k=3):
    question_embedding = embedder.encode([question], convert_to_tensor=True)
    similarities = cosine_similarity(question_embedding.cpu(), embeddings.cpu())[0]
    ranked_indices = similarities.argsort()[::-1]
    return [chunks[i] for i in ranked_indices[:top_k]]

# Endpoint to answer questions
def answer_question(doc_id, question):
    if not doc_id:
        return "fields are required"

    # Retrieve chunks and embeddings
    chunks = documents[doc_id]["chunks"]
    embeddings = documents[doc_id]["embeddings"]

    # Find top-k relevant chunks
    relevant_chunks = retrieve_relevant_chunks(question, chunks, embeddings)

    # Use QA model to get the most accurate answers
    answers = []
    for chunk in relevant_chunks:
        result = qa_pipeline(question=question, context=chunk)
        answers.append({"text": result["answer"], "confidence": result["score"]})

    # Return the most confident answer
    answers = sorted(answers, key=lambda x: x['confidence'], reverse=True)

    # Return answers
    return answers[0]['text']