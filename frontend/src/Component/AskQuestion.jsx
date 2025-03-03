import React, {useState} from 'react';
import axios from 'axios';

export default function AskQuestion({currentPage, setCurrentPage}) {
  const [documents, setDocuments] = useState([]);
  const [uploadData, setUploadData] = useState('');
  const [question, setQuestion] = useState('');
  const [docID, setDocID] = useState(null);
  const [currentChat, setCurrentChat] = useState([{
    type: '',
    reply: ''
  }]);
  const [answers, setAnswers] = [];

  const uploadFile = () => {
    axios.post('http://127.0.0.1:5000/upload-file', { uploadFile: uploadData })
      .then(response => {
        setDocuments(response.data.document);
        setUploadData('');
      })
      .catch(error => console.error(error));
  };

  const getAnswer = () => {
    if (!question.trim()) return; // Prevent empty questions
  
    // Add the user question to the chat
    setCurrentChat((prevChat) => [
      ...prevChat,
      { type: 'user', reply: question },
    ]);
    const questionData = question;
    setQuestion('');
    axios
      .post('http://127.0.0.1:5000/fetch-answer', { documentID: docID, question: questionData })
      .then((response) => {
        // Add the machine's answer to the chat
        setCurrentChat((prevChat) => [
          ...prevChat,
          { type: 'machine', reply: response.data.answer },
        ]);
      })
      .catch((error) => {
        console.error(error);
        
        // Add an error response to the chat
        setCurrentChat((prevChat) => [
          ...prevChat,
          { type: 'machine', reply: 'Error: Unable to fetch the answer.' },
        ]);
      })
      .finally(() => {
        setQuestion(''); // Clear the input after processing
      });
  };


  return (
    <>
      <h1 style={{textAlign: "center"}}>Ask Question from your long text!</h1>

      <div className='flex-container' style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", transition: "all 0.3s ease", height: "100%"}}>
        
        {documents.length>0 && (
          <div className='flex-item' style={{flex: 0.3, transition: "all 0.3s ease", width: "100%"}}>
            <div className='flex-container' style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "5px", transition: "all 0.3s ease"}}>
              <h5>Uploaded Documents</h5>
              {documents && documents.length >0 ? (
                <div>
                  {documents.map((item, index) => (
                    <p style={{cursor: "pointer"}} onClick={() => setDocID(item.documentID)} key={index}>Document ID: {item.documentID}</p>
                  ))}
                </div>
              ):(
                null
              )}
              <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "5px", marginTop: "20px"}}>
                <input
                  type="text"
                  value={uploadData}
                  placeholder={'Enter your text...'}
                  onChange={(e) => setUploadData(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                />
                <i class="fa-solid fa-paper-plane" style={{cursor: "pointer"}} onClick={() => {uploadFile(); setUploadData('')}}></i>
              </div>
            </div>
          </div>
        )}

        <div className='flex-item' style={{flex: documents.length>0 ? 0.7 : 1, transition: "all 0.3s ease"}}>
          <div className='flex-item' style={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", gap: "20px", transition: "all 0.3s ease", height: "100%"}}>
            <div style={{flex: 0.96, height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px"}}>
              {!documents.length>0 && (
                <>
                  <input
                    type="text"
                    value={uploadData}
                    placeholder={'Enter your text...'}
                    onChange={(e) => setUploadData(e.target.value)}
                    style={{ width: '60%', padding: '10px', marginBottom: '20px' }}
                  />
                  <i className="fa-solid fa-paper-plane" style={{cursor: "pointer"}} onClick={() => uploadFile()}></i>
                </>
              )}
              {currentChat.length>0 && (
                <div style={{padding: "20px"}}>
                  {currentChat.map((item, index) => (
                    <div style={{display: "flex", flexDirection: "column", justifyContent: item.type==='machine' ? "flex-start" : "flex-end", alignItems: item.type==='machine' ? "flex-start" : "flex-end", gap: "10px", background: item.type==='machine' ? "lightBlue": "none"}}>
                      <p>{item.reply}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{flex: 0.02, height: "100%", width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px"}}>
              <input
                type="text"
                value={question}
                placeholder={'Enter your question...'}
                onChange={(e) => setQuestion(e.target.value)}
                style={{ width: '93%', padding: '10px', marginBottom: '20px' }}
              />
              <i className="fa-solid fa-paper-plane" onClick={() => getAnswer()}></i>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};