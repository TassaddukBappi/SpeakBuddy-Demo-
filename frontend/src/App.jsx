import React, {useState} from 'react';
import AppHeader from './Component/AppHeader';
import SpeechRecognition from './Component/SpeechRecognition';
import CheckGrammar from './Component/CheckGrammar';
import GetSummary from './Component/GetSummary';
import AskQuestion from './Component/AskQuestion';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      <div className="App">
        <AppHeader currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {currentPage==='home' && (<SpeechRecognition />)}
        {currentPage==='grammar' && (<CheckGrammar />)}
        {currentPage==='summary' && (<GetSummary />)}
        {currentPage==='qa' && (<AskQuestion />)}
      </div>
    </>
  );
}

export default App;
